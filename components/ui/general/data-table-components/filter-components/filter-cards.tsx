import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams, useRouter } from "next/navigation";

// Utility function to convert to Pascal Case with spaces
function toPascalCaseWithSpaces(text: string): string {
  return text
    .split(/_|(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function FilterUi({
  columnName,
  value,
}: {
  columnName: string;
  value: string;
}) {
  const formattedColumnName = toPascalCaseWithSpaces(columnName);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Function to handle removing the filter
  const handleRemoveFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Create a new URLSearchParams to hold the updated parameters
    const newParams = new URLSearchParams();

    // Convert entries to an array and iterate
    Array.from(params.entries()).forEach(([key, paramValue]) => {
      if (!(key === columnName && paramValue === value)) {
        newParams.append(key, paramValue);
      }
    });

    // Update the URL with the modified search parameters
    router.push(`${window.location.pathname}?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-row border-2 rounded-lg overflow-hidden p-0">
      <div className="flex px-4">
        <p className="w-full h-full flex items-center justify-center text-sm">
          <span className="mr-1 font-semibold">{formattedColumnName}</span> is{" "}
          {value}
        </p>
      </div>
      <Separator orientation="vertical" />
      <Button
        variant="ghost"
        className="rounded-none h-8 w-8 p-0"
        onClick={handleRemoveFilter}
      >
        <IoMdClose className="text-xl" />
      </Button>
    </div>
  );
}
