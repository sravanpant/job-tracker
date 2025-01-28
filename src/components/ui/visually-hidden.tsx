export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
      {children}
    </span>
  );
};
