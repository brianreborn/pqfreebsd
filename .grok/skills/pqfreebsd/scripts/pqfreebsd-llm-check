#!/bin/sh
# pqfreebsd-llm-check — can a skill-capable model operate this suite?
# Does not prove "sufficiently advanced." Prints what we can see. Exit 0 only
# if a candidate binary exists AND SKILL.md is present. Attestation is separate.
set -eu

DATADIR="${PQFREEBSD_DATADIR:-/usr/local/share/pqfreebsd}"
SKILL="${DATADIR}/skills/SKILL.md"
found=""
reason=""

have() { command -v "$1" >/dev/null 2>&1; }

if [ -n "${PQFREEBSD_LLM:-}" ]; then
	if have "${PQFREEBSD_LLM}"; then
		found="PQFREEBSD_LLM=${PQFREEBSD_LLM}"
	elif [ -x "${PQFREEBSD_LLM}" ]; then
		found="PQFREEBSD_LLM=${PQFREEBSD_LLM}"
	else
		reason="PQFREEBSD_LLM is set but not executable: ${PQFREEBSD_LLM}"
	fi
fi

if [ -z "$found" ]; then
	for c in grok llm ollama claude copilot; do
		if have "$c"; then
			found="$c"
			break
		fi
	done
fi

echo "pqfreebsd-llm-check"
echo "  skill: ${SKILL}"
if [ -f "$SKILL" ]; then
	echo "  SKILL.md: present"
else
	echo "  SKILL.md: MISSING"
	reason="${reason:-no SKILL.md}"
fi

if [ -n "$found" ]; then
	echo "  candidate: ${found}"
else
	echo "  candidate: none (set PQFREEBSD_LLM to a tool-using agent)"
	reason="${reason:-no LLM candidate}"
fi

echo
echo "A sufficiently advanced model, for this suite, is one that can:"
echo "  - run the interview and write POLICY without inventing compartments"
echo "  - offer test* immediately before each one*"
echo "  - walk Known issues and pqac(7) PRAXIS before oneenforce"
echo "  - report T14 (claims by conjunct) and T16 (parameterized bounds)"
echo "  - refuse oneboot until BOOT_SATISFIED=YES"
echo "  - refuse to kldload mac_lomac in the interview phase"
echo
echo "This script cannot prove those. If the candidate matches, attest:"
echo "  sysrc pqfreebsd_llm_attested=YES"
echo "  touch /var/db/pqfreebsd/llm.attested"
echo

if [ -n "$reason" ] || [ ! -f "$SKILL" ]; then
	echo "FAIL: ${reason:-incomplete}" >&2
	exit 1
fi
echo "OK: candidate present. Attestation is still your conjunct."
exit 0
