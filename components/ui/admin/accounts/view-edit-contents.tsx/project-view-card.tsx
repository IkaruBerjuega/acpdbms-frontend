import Image from "next/image";
//project view card for client and employees view
export function ViewEditCard({
  name,
  address,
  endDate,
  image,
  role,
}: {
  name: string;
  address: string;
  endDate: string;
  edit: boolean;
  canDelete: boolean;
  image: string | null;
  role: string;
}) {
  const imageSrc =
    image ?? "/system-component-images/project-src-placeholder.webp";

  return (
    <div className="rounded-xl overflow-hidden border-[1px] border-gray-200 h-[125px] flex flex-row relative">
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
          <p>Role: {role}</p>
        </div>
      </div>
    </div>
  );
}
