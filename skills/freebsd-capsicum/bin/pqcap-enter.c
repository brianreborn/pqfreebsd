/*
 * pqcap-enter — first-pass Capsicum wrapper.
 * caph_limit_stdio + caph_enter + exec. Not Casper.
 * Light-ware License. Copyright (c) 2026 Brian Fundakowski Feldman.
 */
#include <err.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#ifdef __FreeBSD__
#include <sys/capsicum.h>
#include <capsicum_helpers.h>
#endif

int
main(int argc, char *argv[])
{
	if (argc < 2)
		errx(1, "usage: pqcap-enter command [args ...]");

#ifndef __FreeBSD__
	errx(1, "pqcap-enter requires FreeBSD cap_enter(2)");
#else
	caph_cache_catpages();
	caph_cache_tzdata();
	if (caph_limit_stdio() < 0)
		err(1, "caph_limit_stdio");
	if (caph_enter() < 0)
		err(1, "caph_enter");
	execvp(argv[1], argv + 1);
	err(1, "%s", argv[1]);
#endif
}
