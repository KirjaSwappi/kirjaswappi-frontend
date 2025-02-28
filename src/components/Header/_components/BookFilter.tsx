import Button from "../../shared/Button";
import Image from "../../shared/Image";
import deleteIcon from "../../../assets/deleteIcon.png";
import Line from "../../shared/Line";

export default function BookFilter() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-grayDark font-poppins font-medium text-sm">
          Book Filter
        </h3>
        <Button className="flex items-center gap-1 h-[26px] bg-[#DBEDFF] border border-primary text-xs font-poppins font-normal text-primary px-2 py-1 rounded-lg">
          <div className="w-3 h-3 flex items-center justify-center">
            <Image src={deleteIcon} alt="Delete Icon" className="h-fit" />
          </div>
          Clear all
        </Button>
      </div>
      <Line className="mt-4"/>
    </div>
  );
}
