import type { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
  h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,

  h2: (props) => <h2 className="text-xl font-semibold mt-6 mb-3" {...props} />,

  h3: (props) => <h3 className="text-lg font-semibold mt-5 mb-2" {...props} />,

  p: (props) => <p className="text-base mb-4" {...props} />,

  ul: (props) => <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />,

  ol: (props) => <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />,

  li: (props) => <li {...props} />,

  a: (props) => (
    <a className="underline underline-offset-4 hover:text-primary" {...props} />
  ),

  hr: (props) => <hr className="my-8 border-border" {...props} />,

  blockquote: (props) => (
    <blockquote
      className="border-l-4 pl-4 italic text-muted-foreground my-4"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
