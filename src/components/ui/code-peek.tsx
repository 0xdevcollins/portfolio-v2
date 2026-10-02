/**
 * A real excerpt of source code or terminal output, shown where a project
 * has no screens to capture. Highlights in ink, everything else in grey,
 * comments faint.
 */
type Variant = "rust" | "shell" | "plain";

const RUST = /^(pub|fn|let|mut|if|return|for|in|Err|Ok|Result|Vec|BytesN|Hash|Env|u32)$/;

function Line({ text, variant }: { text: string; variant: Variant }) {
  const comment = text.indexOf(variant === "rust" ? "//" : "#");
  const code = comment >= 0 ? text.slice(0, comment) : text;
  const note = comment >= 0 ? text.slice(comment) : "";

  let body: React.ReactNode = code;
  if (variant === "rust") {
    body = code.split(/(\b\w+\b)/).map((part, i) =>
      RUST.test(part) ? (
        <span key={i} className="text-white">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  } else if (variant === "shell") {
    const [cmd, ...rest] = code.split(" ");
    body = (
      <>
        <span className="text-white/30">$ </span>
        <span className="text-white">{cmd}</span> {rest.join(" ")}
      </>
    );
  }

  return (
    <>
      {body}
      {note && <span className="text-white/30">{note}</span>}
    </>
  );
}

export function CodePeek({
  file,
  code,
  variant = "rust",
  chipSpace = false,
}: {
  file: string;
  code: string;
  variant?: Variant;
  /** Leave room on the left for a label chip laid over the header. */
  chipSpace?: boolean;
}) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div className="absolute inset-0 flex flex-col bg-night text-white/55">
      <div className={`flex items-center gap-1.5 border-b border-white/10 py-3 pr-4 ${chipSpace ? "pl-[118px]" : "pl-4"}`}>
        {!chipSpace && (
          <>
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </>
        )}
        <span className="ml-auto truncate pl-3 font-mono text-[11px] text-white/40">{file}</span>
      </div>
      <pre className="flex-1 overflow-hidden px-4 py-4 font-mono text-[11.5px] leading-[1.75]">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre">
            <Line text={l} variant={variant} />
          </div>
        ))}
      </pre>
    </div>
  );
}

export const dvnSnippet = `pub fn verify_quorum(
    env: &Env,
    digest: &Hash<32>,
    signatures: &Vec<BytesN<65>>,
    signers: &Vec<BytesN<20>>,
    threshold: u32,
) -> Result<(), DvnError> {
    if threshold == 0 {
        return Err(DvnError::InvalidThreshold);
    }
    if signatures.len() < threshold {
        return Err(DvnError::QuorumNotMet);
    }
    // Bound the work an unauthenticated caller can induce.
    if signatures.len() > signers.len() {
        return Err(DvnError::TooManySignatures);
    }
`;

/** From the stellar-dvn README. */
export const dvnTests = `cargo test                       # 85 tests across contracts and verifier
stellar contract build
./scripts/e2e-security-stack.sh  # the full receive flow, 2-of-3 quorum
./scripts/e2e-real-layerzero.sh  # fee + attestation against real contracts
`;

/** From the Moat README. */
export const moatCli = `moat init        # scaffold a commented moat.yaml
moat validate    # schema + referential integrity
moat generate    # write the threat register into the file
moat report      # markdown, with a mermaid DFD at the end
moat check       # CI gate: exit 1 on open high-or-above
`;

/** From the nivoui README. */
export const nivouiTree = `nivoui/
├── apps/
│   ├── docs/          # Documentation site
│   ├── studio/        # Visual builder
│   └── sandbox/       # Component testing
├── packages/
│   ├── ui/            # Component registry
│   ├── react/         # React hooks & providers
│   ├── cli/           # CLI tool
│   └── utils/         # Shared utilities
└── tooling/           # Build scripts & codegen
`;

/** From the QueryMaster README. */
export const queryMasterFeatures = `# QueryMaster
- Create and manage projects
- Upload files to projects
- Generate vector embeddings using OpenAI
- Store the embeddings in Pinecone
- Query files through a chatbot interface
`;
