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
    <section className="mt-8 flex justify-between items-start gap-x-10">
      {/* form section */}
      <div className="">{children}</div>

      {/* image section */}
      <div className="w-[450px] aspect-[4/3] rounded-lg overflow-hidden border">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
      </div>
    </section>
  );
}
