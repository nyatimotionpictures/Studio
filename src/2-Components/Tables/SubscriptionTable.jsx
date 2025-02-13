import React, { useMemo } from "react";
import CustomStack from "../Stacks/CustomStack";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Button from "../Buttons/Button";
import { Alert, Snackbar, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import SearchInput from "./SearchInput";

import moment from "moment-timezone";
import { useMutation } from "@tanstack/react-query";
import { checkFilmPurchase } from "../../5-Store/TanstackStore/services/api";
import { queryClient } from "../../lib/tanstack";

const SubscriptionTable = ({ transactions }) => {
  console.log(transactions)
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);


  let checkFunc = (details) => {
    // console.log(details)
    let newValues = {
      orderId: details.orderTrackingId,
      type: details.paymentMethodType,
    }
    checkPurchaseMutation.mutate(newValues)
    
  }

  let checkPurchaseMutation = useMutation(
    {
      mutationFn: checkFilmPurchase,
      onSuccess: async (data, variables, context) => {
        setSnackbarMessage({ message: data.message, severity: "success" });
        await queryClient.invalidateQueries({ queryKey: ["purchases"] });
        // handleEditing();
      },
      onError: (error) => {
       
        setSnackbarMessage({
          message: error?.message,
          severity: "error",
        });
      },
    }
  )


  const data = useMemo(() => transactions ?? [], [transactions]);

  const columnHelper = createColumnHelper();

  /** @type import('@tanstack/react-table).ColumnDef<any> */
  const columns = [
    columnHelper.accessor("firstname", {
      cell: (info) => (
        <div className="flex flex-col gap-1">
          <p>{info.row.original?.user?.firstname + " " + info.row.original?.user?.lastname}</p>
          <p className="text-secondary-500">{info.row.original?.user?.email}</p>
        </div>
      
      ),
      header: "Name",
    }),

    // {
    //   header: "Email",
    //   accessorKey: "user.email",
    //   footer: "Phone number",
    // },

    columnHelper.accessor("content", {
      cell: (info) => <p>{info.row.original.purchase?.filmId ? info.row.original.purchase?.film?.title : info.row.original.purchase?.season?.title}</p>,
      header: "Content",
    }),

    columnHelper.accessor("dateCreated", {
      cell: (info) => (
        <p>{moment(info.getValue()).format("DD/MMM/YYYY - hh:mm:ss a")}</p>
      ),
      header: "Date",
    }),
    columnHelper.accessor("amount", {
      cell: (info) => (
        <p>
          {info.row.original.currency} {info.getValue()}
        </p>
      ),
      header: "Amount",
    }),
    columnHelper.accessor("", {
      cell: (info) => (
        <p>
          {
            <div
              className={`w-max h-max  px-2 py-1 border  rounded-lg ${
                info.row.original.status?.toLowerCase()?.includes("success") &&
                "border-[#18AC55] text-[#18AC55]"
              } ${
                info.row.original.status?.toLowerCase()?.includes("failed") &&
                "border-[#DB3B22] text-[#DB3B22]"
              } ${
                info.row.original.status?.toLowerCase()?.includes("pending") &&
                "border-[#FC9405] text-[#FC9405]"
              }`}
            >
              {info.row.original.status}
            </div>
          }
        </p>
      ),
      header: "Status",
    }),
    columnHelper.accessor("paymentMethodType", {
      cell: (info) => (
        <div className=" w-max h-max text-primary-500 px-2 py-1 border border-primary-500 rounded-lg bg-secondary-800 ">
          {info.getValue()}
        </div>
      ),
      header: "Method",
    }),
    columnHelper.accessor("status", {
      cell: (info) => (
        <div className=" w-max h-max px-2 py-1  ">
          {
            info.row.original.status?.toLowerCase()?.includes("pending") &&  (
            <div className="flex flex-row gap-2 items-center">
             <Button disabled={checkPurchaseMutation.isPending} onClick={() => checkFunc(info.row.original)} className="w-max h-max text-secondary-900 hover:bg-transparent hover:text-whites-40 px-2 py-1 bg-whites-40 border border-whites-40 rounded-lg  ">
              {
                checkPurchaseMutation.isPending ? "Checking..." : "Check"
              }
              
              
              </Button>
             {/* <Button  className="w-max h-max text-secondary-900 hover:bg-transparent hover:text-whites-40 px-2 py-1 bg-whites-40 border border-whites-40 rounded-lg  ">Give Access</Button> */}
            </div>
           )
          }
         
        </div>
      ),
      header: "Verify",
    }),
  ];

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const dataXLSXexport = (data = [], fileName) => {
    const datas = data?.length ? data : [];
    const worksheet = XLSX.utils.json_to_sheet(datas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");
    XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "data.xlsx");
  };

  return (
    <CustomStack className="flex-col ">
      <CustomStack className="justify-between items-center">
        <div className="w-full flex items-center gap-1 mb-6">
          <span className="icon-[solar--minimalistic-magnifer-broken] text-whites-100 w-5 h-5"></span>
          <SearchInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-secondary-600 font-[Inter-Regular] text-sm text-whites-500"
            placeholder="Search all columns..."
          />
        </div>
        <CustomStack className="items-center gap-4">
          {/** btn - columns btn */}
          {/* <Button className="flex items-center gap-2 bg-secondary-900 rounded-lg px-4">
          <Typography className="font-[Inter-SemiBold]">Columns</Typography>
          <span className="icon-[solar--alt-arrow-down-linear] w-4 h-4"></span>
        </Button> */}
          {/** btn - export btn */}
          <Button
            onClick={() => dataXLSXexport(data, "custom")}
            className="flex items-center gap-2 bg-secondary-900 rounded-lg px-4"
          >
            <span className="icon-[solar--download-minimalistic-linear] w-4 h-4"></span>
            <Typography className="font-[Inter-SemiBold]">Export</Typography>
          </Button>
        </CustomStack>
      </CustomStack>
      {/** table and pagination */}
      <div className="max-w-5xl text-whites-40">
        {/** table */}
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-y border-secondary-600 hover:bg-secondary-400"
                >
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
              ))
            ) : (
              <tr className="text-center h-32 border-y border-secondary-600">
                <td colSpan={12} className="font-[Inter-Regular] text-sm">
                  No Records Found!
                </td>
              </tr>
            )}
          </tbody>
          <tfoot></tfoot>
        </table>

        {/** pagination */}
        <div className="flex items-center justify-end mt-5 gap-2">
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
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded bg-transparent opacity-[100%] w-16 outline-none"
            />
          </span>
          <select
            name=""
            id=""
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="p-2 bg-transparent outline-none"
          >
            {[5, 8, 10, 20, 30, 40, 50].map((pageSize) => (
              <option
                key={pageSize}
                value={pageSize}
                className="bg-secondary-700"
              >
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/** snackbar */}
      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarMessage?.severity} variant="filled">
          {snackbarMessage?.message}
        </Alert>
      </Snackbar>
    </CustomStack>
  );
};

export default SubscriptionTable;
