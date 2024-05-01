import React, { useMemo } from 'react'
import CustomStack from '../Stacks/CustomStack'
import {useReactTable, getCoreRowModel, flexRender,getPaginationRowModel} from "@tanstack/react-table"

const newData = [
  {
    content: "addams Family VALUES hgcgfhgdfhf hfdgfhdf dfhgdfhgdf hgdhfgdhf gfhdhgf gfgsfhdghsdf bgdfghdfg hvfghdfgd bdfvsgdffd shjgdvsfuf jsdfvcefuyve gdvfvvev",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
  {
    content: "addams Family VALUES",
    ReleaseDate: "8 Sept, 2020",
    type: "Movie",
    Genre: "Comedy",
    Year: "2023",
    DatePublished: "Dec 30, 2019 07:52",
    DTO: "1",
    action: "1",
  },
];
const VideoListTable = () => {
    /**
     * {
     content : "addams Family VALUES",
     ReleaseDate: "8 Sept, 2020",
     type: "Movie",
     Genre,
     Year,
     Date Published,
     DTO/DTR,
     Actions
     * }
     */

    const data = useMemo(() => newData, [])
    
    /** @type import('@tanstack/react-table).ColumnDef<any> */
    const columns = [
      {
        header: "Content",
        accessorKey: "content",
        footer: "Content",
      },
      {
        header: "Release Date",
        accessorKey: "ReleaseDate",
        footer: "Content",
      },
      {
        header: "Type",
        accessorKey: "type",
        footer: "Content",
      },
      {
        header: "Genre",
        accessorKey: "Genre",
        footer: "Content",
      },
      {
        header: "Year",
        accessorKey: "Year",
        footer: "Content",
      },
      {
        header: "Date Published",
        accessorKey: "DatePublished",
        footer: "Content",
      },
      {
        header: "DTO/DTR",
        accessorKey: "DTO",
        footer: "Content",
      },
      {
        header: "Action",
        accessorKey: "",
        footer: "Content",
      },
    ];

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });
    
    return (
      <CustomStack className="flex-col">
        <div>Search table</div>
        <div className="max-w-5xl text-whites-40">
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-2 px-3.5 capitalize text-whites-40 font-[Inter-SemiBold] text-sm"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className=" border-y border-secondary-600">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-3 px-3.5 text-ellipsis max-w-xs text-sm font-[Inter-Regular]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>

          {/** pagination */}
          <div className="flex items-center justify-end mt-2 gap-2">
            <button
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              className="p-1 border border-secondary-600 px-2 disabled:opacity-30"
            >
              {"<"}
            </button>
            <button
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              className="p-1 border border-secondary-600 px-2 disabled:opacity-30"
            >
              {">"}
            </button>

            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>

                    <span className="flex items-center gap-1">
                    | Go to page: <input type="number" defaultValue={table.getState().pagination.pageIndex + 1} />
                    </span>
          </div>
        </div>
      </CustomStack>
    );
}

export default VideoListTable