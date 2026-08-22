import { formatMode } from "./policy";
import type { Policy, World } from "./types";

export function policyFile(policy: Policy) {
  return `# pqfreebsd POLICY — emitted after interview. Reconfirm on the host.
TRUSTED_CLASS=trusted
SANDBOX_CLASS=sandbox
TRUSTED_GROUP=${policy.trustedGroup}
SANDBOX_GROUP=${policy.sandboxGroup}
TRUSTED_MEMBERS=${policy.trustedMembers.join(",")}
SANDBOX_MEMBERS=${policy.sandboxMembers.join(",")}
DEFAULT_ROLE=${policy.defaultRole}
ROOT_LABEL=${policy.rootLabel}
TRUSTED_LABEL=${policy.trustedLabel}
SANDBOX_LABEL=${policy.sandboxLabel}
LEDGER_DATASET=${policy.ledgerDataset}
LEDGER_LABEL=lomac/high
DAC_MODE=${policy.dacMode}
HASH=${policy.hashName}
WITH_LOMAC=${policy.withLomac ? "YES" : "NO"}
WITH_SEEOTHERUIDS=${policy.withSeeotheruids ? "YES" : "NO"}
HOMES_MATCH_CLASS=${policy.homesMatchClass ? "YES" : "NO"}
BOOT_SATISFIED=${policy.bootSatisfied ? "YES" : "NO"}
REPLICA_ENABLED=${policy.replicaEnabled ? "YES" : "NO"}
REPLICA_PEER=${policy.replicaPeer}
SKIP_SNAPSHOT=0
# Do not kldload mac_lomac(4) or set enabled=1 until a test window.
# oneboot (splash, shield, loader) only if BOOT_SATISFIED=YES. TPM not this pass.
`;
}

export function dacContexts(world: World) {
  const lines = [
    "# pqdac specfile — first match wins (same combinator as setfsmac(8)).",
    "# path-regex  owner  group  dir_mode  file_mode",
    "# Restricted language: no arbitrary grant verbs. HRU safety is the point.",
  ];
  for (const r of world.rules) {
    lines.push(
      `${r.pattern.padEnd(28)} ${r.owner.padEnd(8)} ${r.group.padEnd(8)} ${formatMode(r.dirMode)} ${formatMode(r.fileMode)}  # ${r.id}`,
    );
  }
  return lines.join("\n") + "\n";
}

export function suiteFile(policy: Policy) {
  return `WITH_LOMAC=${policy.withLomac ? "YES" : "NO"}
WITH_GENERIC=${policy.withSeeotheruids ? "YES" : "NO"}
WITH_LEDGER=YES
WITH_DAC=YES
PARENT=freebsd-mac-grok
`;
}

export function resultReadme(policy: Policy) {
  return `# pqfreebsd result

Derived from freebsd-mac-grok. Light-ware License. This product includes
software developed by Brian Fundakowski Feldman.

Interview (reconfirm on the host, do not treat the workbench as the box):

- trusted: ${policy.trustedGroup} ∋ ${policy.trustedMembers.join(", ") || "(empty)"}
- sandbox: ${policy.sandboxGroup} ∋ ${policy.sandboxMembers.join(", ") || "(empty)"}
- root: ${policy.rootLabel}
- ledger: ${policy.ledgerDataset} labeled lomac/high
- A_D morphism: ${policy.dacMode}
- hash: ${policy.hashName} (workbench chain is SHA-256; production SHA-512)

Order (strict). test* before each one*. Console. Walk Known issues and pqac(7) PRAXIS.

    sudo ./pqfreebsd oneinstall
    sudo service pqfreebsd onesnapshot
    sudo service pqfreebsd onestage
    sudo service pqfreebsd onesnapshot_after
    sudo service pqfreebsd onestart          # kldload, enabled=0
    sudo service pqledger onestage
    sudo service pqdac oneestablish
    sudo service mac_lomac_grok onelabel && onechecklabels
    sudo service pqfreebsd oneenforce        # only in a test window
${policy.bootSatisfied ? "    sudo service pqfreebsd oneboot           # splash, shield. TPM not this pass\n" : "    # oneboot withheld: BOOT_SATISFIED=NO (default). Do not rebrand an untrusted box.\n"}
oneuninstall restores PREINSTALL behavior. ZFS snaps kept. Ledger xattrs remain
inert without the kld. uninstall ≠ wipe ≠ pool rewind.

Requires sibling plugin: grok plugin install brianreborn/freebsd-mac-grok --trust
`;
}

export type EmittedFile = { path: string; body: string };

export function emitResult(world: World): EmittedFile[] {
  const p = world.policy;
  const files: EmittedFile[] = [
    { path: "POLICY", body: policyFile(p) },
    { path: "SUITE", body: suiteFile(p) },
    { path: "dac.contexts", body: dacContexts(world) },
    { path: "README", body: resultReadme(p) },
    {
      path: "ledger.conf",
      body: `ledger_dataset="${p.ledgerDataset}"
ledger_label="lomac/high"
hash="${p.hashName}"
source="audit,vnode,policy"
rotate="append-checkpoint"
# rewrite is a bug
`,
    },
  ];
  files.push({
    path: "policy.revs",
    body:
      (world.revs ?? [])
        .map(
          (r) =>
            `${r.seq} ${r.ts} policy=${r.policyHash} catalog=${r.catalogHash} prev=${r.prevCatalog} fails=${r.fails} warns=${r.warns}`,
        )
        .join("\n") + "\n",
  });
  if (p.bootSatisfied) {
    files.push({
      path: "boot/loader.conf.local",
      body: `# Emitted only after BOOT_SATISFIED=YES. TPM / measured boot: not this pass.
loader_color="YES"
beastie_disable="NO"
loader_logo="pqfreebsd"
loader_brand="pqfreebsd"
# /boot/logo-pqfreebsd.4th — ASCII shield + sword + SGR gleam
# /boot/brand-pqfreebsd.4th — wordmark
# TPM / measured boot: not this pass
# brand-pqfreebsd.4th draws the shield (armor of God), not the daemon.
# If pqcode keys are absent, oneboot refuses and says so.
# Name on the splash: pqfreebsd
`,
    });
    files.push({
      path: "boot/README",
      body: `# pqboot (gated)

You attested that the system is PQ-hardened to the degree that gives you
a sense of security. This directory is that morphism:

- Splash name: pqfreebsd (not FreeBSD)
- Mark: the shield, the armor of God (not the beastie)
- Loader: signed blob only if pqcode keys exist
- TPM: not this pass

oneboot copies shield art and brand-pqfreebsd.4th, writes loader.conf.local.
oneuninstall restores the stock beastie and name.
`,
    });
  }
  return files;
}

export function downloadText(filename: string, body: string) {
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
