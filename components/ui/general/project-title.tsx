interface PageTitleProps {
  pageTitle: string;
}

export default function PageTitle({ pageTitle }: PageTitleProps) {
  return <h1 className='text-maroon-700 text-[18px] font-bold'>{pageTitle}</h1>;
}
