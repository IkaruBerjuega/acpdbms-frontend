import { Button } from "@/components/ui/button";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import Image from "next/image";

//project view card for client and employees view
export function ViewEditCard({
  name,
  address,
  endDate,
  id,
  edit,
  canDelete,
  image,
}: {
  name: string;
  address: string;
  endDate: string;
  id: string;
  edit: boolean;
  canDelete: boolean;
  image: string | null;
}) {
  const imageSrc =
    image ?? "/system-component-images/project-src-placeholder.webp";

  return (
    <div className="rounded-xl overflow-hidden border-[1px] border-gray-200 h-[100px] flex flex-row">
      <div className="bg-gray-550 justify-center items-center h-full w-[30%]">
        <Image
          src={imageSrc}
          alt={`${name} Image`}
          className="object-cover h-full w-full"
          width={1000}
          height={1000}
          draggable={false}
        />
      </div>
      <div className="flex-grow p-2 text-sm flex ">
        <div>
          <p className="font-bold">{name}</p>
          <p>Address: {address}</p>
          <p>End Date: {endDate}</p>
        </div>

        {edit && canDelete && (
          <Button
            type="button"
            variant="ghost"
            className=" rounded-md text-red-600 hover:text-red-700 transition-all duration-200 ease-in-out p-0 h-8 w-8"
          >
            <IoMdRemoveCircleOutline className="text-2xl" />
          </Button>
        )}
      </div>
    </div>
  );
}
