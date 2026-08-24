/*
 * pqcap-enter — Capsicum wrapper for low-integrity agents (T18, T20).
 * Open --root first, limit rights, expose PQCAP_ROOTFD, caph_enter, exec.
 * Child must openat(PQCAP_ROOTFD, …). namei of new paths is the TOCTOU we close.
 * Not Casper. Light-ware License. Copyright (c) 2026 Brian Fundakowski Feldman.
 */
#include <err.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#ifdef __FreeBSD__
#include <sys/capsicum.h>
#include <capsicum_helpers.h>
#endif

#ifndef PQCAP_ROOT_FD
#define PQCAP_ROOT_FD 3
#endif

static void
usage(void)
{
	errx(1, "usage: pqcap-enter [--root dir] command [args ...]");
}

int
main(int argc, char *argv[])
{
	const char *root = NULL;
	int i;

	if (argc < 2)
		usage();

	i = 1;
	while (i < argc && argv[i][0] == '-') {
		if (strcmp(argv[i], "--") == 0) {
			i++;
			break;
		}
		if (strcmp(argv[i], "--root") == 0) {
			if (i + 1 >= argc)
				usage();
			root = argv[++i];
			i++;
			continue;
		}
		usage();
	}
	if (i >= argc)
		usage();

#ifndef __FreeBSD__
	(void)root;
	errx(1, "pqcap-enter requires FreeBSD cap_enter(2)");
#else
	caph_cache_catpages();
	caph_cache_tzdata();

	if (root != NULL) {
		int rfd, keep;
		cap_rights_t rights;

		rfd = open(root, O_DIRECTORY | O_RDONLY);
		if (rfd < 0)
			err(1, "open %s", root);
		cap_rights_init(&rights,
		    CAP_LOOKUP, CAP_READ, CAP_WRITE, CAP_SEEK,
		    CAP_FSTAT, CAP_FCHDIR, CAP_CREATE, CAP_FCNTL,
		    CAP_FTRUNCATE, CAP_FSYNC, CAP_UNLINKAT, CAP_MKDIRAT);
		if (cap_rights_limit(rfd, &rights) < 0)
			err(1, "cap_rights_limit");
		if (dup2(rfd, PQCAP_ROOT_FD) < 0)
			err(1, "dup2");
		if (rfd != PQCAP_ROOT_FD)
			close(rfd);
		keep = fcntl(PQCAP_ROOT_FD, F_GETFD);
		if (keep < 0)
			err(1, "fcntl");
		keep &= ~FD_CLOEXEC;
		if (fcntl(PQCAP_ROOT_FD, F_SETFD, keep) < 0)
			err(1, "fcntl");
		if (fchdir(PQCAP_ROOT_FD) < 0)
			err(1, "fchdir");
		if (setenv("PQCAP_ROOTFD", "3", 1) < 0)
			err(1, "setenv");
	}

	if (caph_limit_stdio() < 0)
		err(1, "caph_limit_stdio");
	if (caph_enter() < 0)
		err(1, "caph_enter");
	execvp(argv[i], argv + i);
	err(1, "%s", argv[i]);
#endif
}
