import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { TableCompProps } from "../../interfaces/card-interface";

// Estilo CSS en línea para el tooltip
const tooltipStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 1000,
  display: "none",
  top: "100%",
  left: "100%",
  transform: "translateX(-100%)",
  maxWidth: "300px", // Ajusta el ancho máximo del preview
};

export default function TableComp<T extends object, V extends React.ReactNode>({
  data,
  excludeFields = [],
  display = [],
  additionalField,
}: TableCompProps<T, V>) {
  if (data.length === 0) return <p>No data available</p>;
  const headers = Object.keys(data[0]) as (keyof T)[];

  const filteredHeaders =
    excludeFields.length > 0
      ? headers.filter((header) => !excludeFields.includes(header))
      : display.length > 0
      ? headers.filter((header) => display.includes(header))
      : headers;

  const finalHeaders = additionalField
    ? [...filteredHeaders, additionalField.key]
    : filteredHeaders;

  return (
    <Table
      aria-label="Example static collection table"
      className="text-custom-silver-accent"
    >
      <TableHeader>
        {finalHeaders.map((header) => (
          <TableColumn key={header as string}>
            {String(header).toUpperCase()}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index} className="hover:bg-custom-dark-accent">
            {finalHeaders.map((header) => (
              <TableCell key={header as string}>
                {header === "img" ? (
                  <div className="relative">
                    <img
                      src="/lens.svg"
                      alt="Preview"
                      className="cursor-pointer"
                      onMouseOver={(e) => {
                        const tooltip = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        tooltip.style.display = "block";
                      }}
                      onMouseOut={(e) => {
                        const tooltip = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        tooltip.style.display = "none";
                      }}
                    />
                    <div
                      style={tooltipStyle}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/4 w-96 h-auto"
                    >
                      <img
                        src={`/cards/${row["id"]}.png`}
                        alt="Preview"
                        className="absolute mt-2 w-full h-auto"
                      />
                    </div>
                  </div>
                ) : header === additionalField?.key ? (
                  additionalField.value
                ) : (
                  (String(row[header as keyof T]) as React.ReactNode)
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
