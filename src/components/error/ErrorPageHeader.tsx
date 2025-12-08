interface IProps {
  title: string;
  paragraph: string;
}

export default function ErrorPageHeader({ title, paragraph }: IProps) {
  return (
    <div className=" font-poppins ">
      <h1 className=" font-semibold text-[24px] lg:text-[32px] leading-[40px] text-richBlack mb-5 text-center ">
        {title}
      </h1>
      <p className=" text-grayDark font-light text-[14px] leading-[21px] w-[80%] lg:w-[90%] mx-auto text-center ">
        {paragraph}
      </p>
    </div>
  );
}
