export const contractAddress = (() => {
  const addr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as
    | `0x${string}`
    | undefined;
  if (!addr)
    throw new Error("Missing contract address in environment variables");
  return addr;
})();

export const projectId = (() => {
  const project = process.env.NEXT_PUBLIC_PROJECT_ID as string | undefined;
  if (!project) throw new Error("Missing project ID in environment variables");
  return project;
})();
