/**
 * The TrustedBSD Project — papers and docs that are *not* in the base
 * FreeBSD install (not mac(4), not mac(9), not Handbook ch. MAC as man).
 * Cite these. Do not treat the man pages as the project.
 */

export const TRUSTEDBSD_HOME = "http://www.trustedbsd.org/";
export const TRUSTEDBSD_DOCS = "http://www.trustedbsd.org/docs.html";
export const TRUSTEDBSD_MAC = "http://www.trustedbsd.org/mac.html";
export const TRUSTEDBSD_SEBSD = "http://www.trustedbsd.org/sebsd.html";
export const TRUSTEDBSD_AUDIT = "http://www.trustedbsd.org/audit.html";

export const TRUSTEDBSD_BLURB = `The TrustedBSD Project (April 2000–) added trusted-operating-system features to FreeBSD: the MAC Framework, security event auditing / OpenBSM, ACLs, UFS2, OpenPAM, and the kernel pieces SEBSD later plugged into. mac(4) and audit(4) in GENERIC are that work, upstreamed. The papers are not in the base install. This suite is a consumer of that framework, not a replacement for it.`;

export type TbsdPaper = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  url: string;
  why: string;
};

export const TRUSTEDBSD_PAPERS: TbsdPaper[] = [
  {
    id: "bsdcon-2000",
    title: "Introducing Supporting Infrastructure for Trusted Operating System Support in FreeBSD",
    authors: "Robert N. M. Watson",
    venue: "BSDCon, Monterey",
    year: "2000",
    url: "http://www.trustedbsd.org/trustedbsd-bsdcon-2000.pdf",
    why: "Project origin. Not a man page.",
  },
  {
    id: "freenix-2001",
    title: "TrustedBSD: Adding Trusted Operating System Features to FreeBSD",
    authors: "Robert N. M. Watson",
    venue: "USENIX ATC, FREENIX Track, Boston",
    year: "2001",
    url: "http://www.trustedbsd.org/trustedbsd-freenix-2001.pdf",
    why: "The named project paper. Also: https://www.usenix.org/legacy/publications/library/proceedings/usenix01/freenix01/full_papers/watson/watson.pdf",
  },
  {
    id: "discex3-2003",
    title: "Design and Implementation of the TrustedBSD MAC Framework",
    authors: "Robert Watson, Brian Feldman, Adam Migus, Chris Vance",
    venue: "DARPA DISCEX III, IEEE, Washington DC",
    year: "2003",
    url: "http://www.trustedbsd.org/trustedbsd-discex3.pdf",
    why: "MAC Framework design. Not in src/share/man.",
  },
  {
    id: "usenix-2003",
    title: "The TrustedBSD MAC Framework: Extensible Kernel Access Control for FreeBSD 5.0",
    authors: "Robert Watson, Wayne Morrison, Chris Vance, Brian Feldman",
    venue: "USENIX ATC, FREENIX Track, San Antonio",
    year: "2003",
    url: "http://www.trustedbsd.org/trustedbsd-usenix2003freenix.pdf",
    why: "How loadable A_M got into 5.0. USENIX copy: https://www.usenix.org/legacy/event/usenix03/tech/freenix03/full_papers/watson/watson.pdf",
  },
  {
    id: "sebsd-2003",
    title: "Security-Enhanced BSD",
    authors: "Chris Vance, Robert Watson",
    venue: "NAI Labs technical report, Rockville MD",
    year: "2003",
    url: "http://www.trustedbsd.org/sebsd-july2003.pdf",
    why: "FLASK/TE on the MAC Framework. sebsd.html is idle; this is the paper. Not in base.",
  },
  {
    id: "audit-2006",
    title: "The FreeBSD Audit System",
    authors: "Robert N. M. Watson, Wayne Salamon",
    venue: "UKUUG LISA, Durham",
    year: "2006",
    url: "http://www.trustedbsd.org/docs.html",
    why: "OpenBSM / audit(4) implementation paper. Index on the docs page; not audit(4).",
  },
  {
    id: "tr-818",
    title: "New Approaches to Operating System Security Extensibility",
    authors: "Robert N. M. Watson",
    venue: "University of Cambridge Computer Laboratory, UCAM-CL-TR-818",
    year: "2012",
    url: "https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-818.pdf",
    why: "Dissertation: MAC Framework, Capsicum. HTML: https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-818.html",
  },
  {
    id: "cacm-2013",
    title: "A Decade of OS Access-Control Extensibility",
    authors: "Robert N. M. Watson",
    venue: "Communications of the ACM 56(2) / ACM Queue",
    year: "2013",
    url: "https://queue.acm.org/detail.cfm?id=2436814",
    why: "Why a framework, not a single policy. Not in the Handbook.",
  },
];

export const TRUSTEDBSD_HANDBOOK = [
  {
    title: "FreeBSD Handbook: Mandatory Access Control",
    url: "https://docs.freebsd.org/en/books/handbook/mac/",
  },
  {
    title: "FreeBSD Handbook: Security Event Auditing",
    url: "https://docs.freebsd.org/en/books/handbook/audit/",
  },
  {
    title: "FreeBSD Architecture Handbook: The TrustedBSD MAC Framework",
    url: "https://docs.freebsd.org/en/books/arch-handbook/mac/",
  },
];
