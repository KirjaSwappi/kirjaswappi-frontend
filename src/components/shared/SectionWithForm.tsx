type TSectionWithFormProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
};

export default function SectionWithForm({
  children,
  imageSrc,
  imageAlt = 'section image',
}: TSectionWithFormProps) {
  return (
    <section className=" font-poppins  mt-0 lg:mt-12 flex justify-between items-start gap-x-10">
      {/* form section */}
      <div className="w-full lg:w-auto  ">{children}</div>

      {/* image section */}
      <div className=" mt-7 hidden lg:block w-[450px] aspect-[4/3] rounded-lg overflow-hidden ">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
      </div>
    </section>
  );
}
