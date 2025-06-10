import Button from '../../../components/shared/Button';

export default function SwapRequestButton({
  ownerName,
  onClick,
}: {
  ownerName: string;
  onClick: () => void;
}) {
  return (
    <div
      className="h-16 flex items-center gap-1 justify-between text-xs font-normal px-6 fixed bottom-0  bg-white w-full"
      style={{
        boxShadow: '0px 0px 1px 0px #33333345',
      }}
    >
      <div>
        <p className="text-[8px] font-poppins ">Offered by</p>
        <h3 className="text-sm font-poppins font-normal">{ownerName}</h3>
      </div>
      <div>
        <Button
          onClick={onClick}
          className="bg-primary text-white w-[130px] sm:w-[150px] py-2 text-sm font-poppins font-normal rounded-md"
        >
          Request Swap
        </Button>
      </div>
    </div>
  );
}
