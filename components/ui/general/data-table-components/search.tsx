"use client";

import { SearchInput } from "../../input";
import { AiOutlineSearch } from "react-icons/ai"; // Import the search icon from react-icons
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function Search({
  className,
  placeholder,
}: {
  className: string;
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const parameter = "query";
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  // State to hold the current search query
  const [query, setQuery] = useState<string>(params?.get(parameter) || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      params.set(parameter, term);
    } else {
      params.delete(parameter);
    }

    const newUrl = `${pathname}?${params.toString()}`; // ✅ Assignment before use
    replace(newUrl);
    setQuery(term);
  }, 300);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <SearchInput
      type="text"
      placeholder={placeholder}
      className={`text-xs md:text-sm ${className}`}
      icon={<AiOutlineSearch className="h-5 w-5 text-gray-500" />}
      value={query} // Controlled input value
      onChange={handleChange}
    />
  );
}
