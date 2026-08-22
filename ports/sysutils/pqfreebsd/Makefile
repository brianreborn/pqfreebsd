PORTNAME=	pqfreebsd
DISTVERSION=	0.1.0
CATEGORIES=	sysutils security

MAINTAINER=	brianreborn@users.noreply.github.com
COMMENT=	Post-quantum trusted FreeBSD suite (skill-operated)
WWW=		https://github.com/brianreborn/pqfreebsd

LICENSE=	BSD4CLAUSE
LICENSE_FILE=	${WRKSRC}/LICENSE

# In-tree port: built from a pqfreebsd checkout, not a distfile.
# Copy this directory to /usr/ports/sysutils/pqfreebsd or set PORTSDIR.
NO_ARCH=	yes
NO_BUILD=	yes
NO_CHECKSUM=	yes

# A sufficiently advanced LLM that can *operate the skills* is a requirement
# of this package's intended use. Ports cannot RUN_DEPENDS on "advanced".
# OPTION LLM (default) installs the check and refuses oneenforce until attested.
# LOCALLLM group: popular local GPU/CPU runtimes. At least one is recommended.
# RUN_DEPENDS only if that port exists in PORTSDIR; otherwise install the
# binary by hand — llm-check still looks on PATH.
OPTIONS_DEFINE=			LLM
OPTIONS_DEFAULT=		LLM OLLAMA LLAMACPP
OPTIONS_GROUP=			LOCALLLM
OPTIONS_GROUP_LOCALLLM=		OLLAMA LLAMACPP LOCALAI LLAMAFILE VLLM KOBOLDCPP
LLM_DESC=			Require attestation that a skill-capable LLM is present
OLLAMA_DESC=			ollama (local CPU / Vulkan; CUDA often Linuxulator)
LLAMACPP_DESC=			llama.cpp llama-server (CPU and GPU backends, GGUF)
LOCALAI_DESC=			LocalAI (OpenAI-compatible; wraps llama.cpp)
LLAMAFILE_DESC=			Mozilla llamafile (single-file GGUF; CPU/GPU)
VLLM_DESC=			vLLM (GPU serving; CUDA typically Linuxulator)
KOBOLDCPP_DESC=			koboldcpp (llama.cpp server/GUI; CPU/GPU)

WRKSRC=		${WRKDIR}/${PORTNAME}
SKILLDIR=	${.CURDIR}/../../../skills/pqfreebsd
REPODIR=	${.CURDIR}/../../..

SUB_FILES=	pkg-message
SUB_LIST=	PREFIX=${PREFIX} DATADIR=${DATADIR}

.include <bsd.port.options.mk>

.if exists(${PORTSDIR}/misc/ollama)
OLLAMA_RUN_DEPENDS=	ollama:misc/ollama
.endif
.if exists(${PORTSDIR}/misc/llama-cpp)
LLAMACPP_RUN_DEPENDS=	llama-server:misc/llama-cpp
.endif
.if exists(${PORTSDIR}/www/local-ai)
LOCALAI_RUN_DEPENDS=	local-ai:www/local-ai
.endif
# llamafile, vLLM, koboldcpp: often installed by hand. OPTION still records
# llm.enabled; pqfreebsd-llm-check looks on PATH.

do-fetch:
	@${DO_NADA}

do-extract:
	@${MKDIR} ${WRKSRC}
	@${CP} -R ${SKILLDIR}/ ${WRKSRC}/
	@${CP} ${REPODIR}/LICENSE ${WRKSRC}/LICENSE
	@${CP} ${REPODIR}/NOTICE.md ${WRKSRC}/NOTICE.md
	@${CP} ${.CURDIR}/files/pqfreebsd-llm-check.sh ${WRKSRC}/pqfreebsd-llm-check

do-install:
	${MKDIR} ${STAGEDIR}${PREFIX}/etc/rc.d \
		${STAGEDIR}${DATADIR} \
		${STAGEDIR}${DATADIR}/boot \
		${STAGEDIR}${DATADIR}/skills \
		${STAGEDIR}${DATADIR}/man/man4 \
		${STAGEDIR}${DATADIR}/man/man5 \
		${STAGEDIR}${DATADIR}/man/man7 \
		${STAGEDIR}${DATADIR}/man/man8 \
		${STAGEDIR}${PREFIX}/share/man/man4 \
		${STAGEDIR}${PREFIX}/share/man/man5 \
		${STAGEDIR}${PREFIX}/share/man/man7 \
		${STAGEDIR}${PREFIX}/share/man/man8 \
		${STAGEDIR}${PREFIX}/sbin \
		${STAGEDIR}${PREFIX}/etc/pqfreebsd
	${INSTALL_SCRIPT} ${WRKSRC}/scripts/pqfreebsd ${STAGEDIR}${PREFIX}/etc/rc.d/pqfreebsd
	${INSTALL_SCRIPT} ${WRKSRC}/scripts/pqledger ${STAGEDIR}${PREFIX}/etc/rc.d/pqledger
	${INSTALL_SCRIPT} ${WRKSRC}/scripts/pqdac ${STAGEDIR}${PREFIX}/etc/rc.d/pqdac
	${INSTALL_SCRIPT} ${WRKSRC}/pqfreebsd-llm-check ${STAGEDIR}${PREFIX}/sbin/pqfreebsd-llm-check
	${INSTALL_DATA} ${WRKSRC}/SKILL.md ${STAGEDIR}${DATADIR}/skills/SKILL.md
	${INSTALL_DATA} ${WRKSRC}/README.md ${STAGEDIR}${DATADIR}/README.md
	${INSTALL_DATA} ${WRKSRC}/LICENSE ${STAGEDIR}${DATADIR}/LICENSE
	${INSTALL_DATA} ${WRKSRC}/NOTICE.md ${STAGEDIR}${DATADIR}/NOTICE.md
.for f in logo-pqfreebsd.4th brand-pqfreebsd.4th
	${INSTALL_DATA} ${WRKSRC}/boot/${f} ${STAGEDIR}${DATADIR}/boot/${f}
.endfor
.for s in 4 5 7 8
	${INSTALL_MAN} ${WRKSRC}/man/man${s}/* ${STAGEDIR}${PREFIX}/share/man/man${s}/
.endfor
	${INSTALL_DATA} ${.CURDIR}/files/POLICY.sample ${STAGEDIR}${PREFIX}/etc/pqfreebsd/POLICY.sample
	${MKDIR} ${STAGEDIR}${PREFIX}/etc/pqfreebsd
	${ECHO_CMD} "via-port" > ${STAGEDIR}${DATADIR}/VIA-PORT
	${INSTALL_DATA} ${.CURDIR}/files/llm-runtimes ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.runtimes
	${ECHO_CMD} "# LOCALLLM OPTIONS enabled at build" > ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.enabled
.if ${PORT_OPTIONS:MOLLAMA}
	${ECHO_CMD} OLLAMA >> ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.enabled
.endif
.if ${PORT_OPTIONS:MLLAMACPP}
	${ECHO_CMD} LLAMACPP >> ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.enabled
.endif
.if ${PORT_OPTIONS:MLOCALAI}
	${ECHO_CMD} LOCALAI >> ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.enabled
.endif
.if ${PORT_OPTIONS:MLLAMAFILE}
	${ECHO_CMD} LLAMAFILE >> ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.enabled
.endif
.if ${PORT_OPTIONS:MVLLM}
	${ECHO_CMD} VLLM >> ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.enabled
.endif
.if ${PORT_OPTIONS:MKOBOLDCPP}
	${ECHO_CMD} KOBOLDCPP >> ${STAGEDIR}${PREFIX}/etc/pqfreebsd/llm.enabled
.endif
.if ${PORT_OPTIONS:MLLM}
	${ECHO_CMD} "LLM_REQUIRED=YES" >> ${STAGEDIR}${PREFIX}/etc/pqfreebsd/SUITE.sample
.endif

.include <bsd.port.mk>
