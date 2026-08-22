#!/bin/sh
# pqfreebsd-llm-check — is there a local (GPU/CPU) or configured LLM
# that could operate the skills? Does not prove "sufficiently advanced."
# Exit 0 if SKILL.md exists and at least one candidate is present.
set -eu

DATADIR="${PQFREEBSD_DATADIR:-/usr/local/share/pqfreebsd}"
SKILL="${DATADIR}/skills/SKILL.md"
CONF="${PREFIX:-/usr/local}/etc/pqfreebsd"
found=""
nfound=0
reason=""

have() { command -v "$1" >/dev/null 2>&1; }

add() {
	# $1 name  $2 how
	nfound=$((nfound + 1))
	if [ -n "$found" ]; then
		found="${found}, $1 ($2)"
	else
		found="$1 ($2)"
	fi
}

echo "pqfreebsd-llm-check"
echo "  skill: ${SKILL}"
if [ -f "$SKILL" ]; then
	echo "  SKILL.md: present"
else
	echo "  SKILL.md: MISSING"
	reason="no SKILL.md"
fi

echo "  scanning local GPU/CPU runtimes and PQFREEBSD_LLM…"

if [ -n "${PQFREEBSD_LLM:-}" ]; then
	if have "${PQFREEBSD_LLM}" || [ -x "${PQFREEBSD_LLM}" ]; then
		add "PQFREEBSD_LLM" "${PQFREEBSD_LLM}"
	else
		reason="${reason:-PQFREEBSD_LLM is set but not executable: ${PQFREEBSD_LLM}}"
		echo "  PQFREEBSD_LLM: missing (${PQFREEBSD_LLM})"
	fi
fi

# ollama — CPU, Vulkan; CUDA often Linuxulator on FreeBSD
if have ollama; then
	add "ollama" "cpu/vulkan/cuda*"
	ollama list 2>/dev/null | awk 'NR==2{print "  ollama model: "$1; exit}' || true
fi

# llama.cpp server and CLI (GGUF; CPU and GPU backends)
for b in llama-server llama-cli llama-cpp; do
	if have "$b"; then
		add "llama.cpp" "$b"
		break
	fi
done
# some ports install as llama-server under libexec
if ! echo "$found" | grep -q llama.cpp; then
	for p in /usr/local/bin/llama-server /usr/local/libexec/llama.cpp/llama-server; do
		if [ -x "$p" ]; then
			add "llama.cpp" "$p"
			break
		fi
	done
fi

# LocalAI — OpenAI-compatible
for b in local-ai localai; do
	if have "$b"; then
		add "LocalAI" "$b"
		break
	fi
done

# Mozilla llamafile — single-file GGUF, Cosmopolitan; runs on FreeBSD
if have llamafile; then
	add "llamafile" "cpu/gpu"
else
	lf=""
	for d in /usr/local/bin /usr/local/share/llamafile; do
		[ -d "$d" ] || continue
		for f in "$d"/*; do
			[ -x "$f" ] || continue
			case "$f" in
			*.llamafile) lf="$f"; break ;;
			esac
		done
		[ -n "$lf" ] && break
	done
	[ -n "$lf" ] && add "llamafile" "$lf"
fi

# vLLM — GPU serving (CUDA; on FreeBSD typically Linuxulator)
if have vllm; then
	add "vLLM" "gpu-cuda*"
elif python3 -c "import vllm" 2>/dev/null; then
	add "vLLM" "python3 -m vllm"
fi

# koboldcpp
for b in koboldcpp koboldcpp-linux; do
	if have "$b"; then
		add "koboldcpp" "$b"
		break
	fi
done

# remote / hosted — last, not a substitute for the local OPTIONS
for c in grok llm claude copilot; do
	if have "$c"; then
		add "$c" "hosted-or-cli"
	fi
done

if [ -f "${CONF}/SUITE.sample" ] || [ -f "${CONF}/llm.enabled" ]; then
	echo "  port OPTIONS (enabled at build):"
	if [ -f "${CONF}/llm.enabled" ]; then
		sed 's/^/    /' "${CONF}/llm.enabled"
	fi
fi

echo
if [ "$nfound" -gt 0 ]; then
	echo "  candidates: ${found}"
	echo "  * CUDA on FreeBSD is usually Linuxulator, not a native NVIDIA stack."
	echo "    Native local path is CPU and Vulkan."
else
	echo "  candidates: none"
	reason="${reason:-no LLM candidate}"
	echo "  install one of: ollama, llama.cpp (llama-server), LocalAI, llamafile,"
	echo "  vLLM, koboldcpp — or set PQFREEBSD_LLM. See make showconfig LOCALLLM."
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
echo "A runtime on PATH is not that proof. If the model matches, attest:"
echo "  sysrc pqfreebsd_llm_attested=YES"
echo "  touch /var/db/pqfreebsd/llm.attested"
echo

if [ -n "$reason" ] || [ ! -f "$SKILL" ]; then
	echo "FAIL: ${reason:-incomplete}" >&2
	exit 1
fi
echo "OK: candidate present. Attestation is still your conjunct."
exit 0
