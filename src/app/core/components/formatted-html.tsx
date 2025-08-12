const FormattedHtml = ({ text }: { text: string }) => {
  return <div className='prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: text }} />;
};

export default FormattedHtml;
