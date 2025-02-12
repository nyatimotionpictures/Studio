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
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { useMutation } from "@tanstack/react-query";
import { deleteEpisode } from "../../5-Store/TanstackStore/services/api";
import { queryClient } from "../../lib/tanstack";


const EpisodesListTable = ({ handleNewEpisode, season }) => {

   
    let navigate = useNavigate()
    let params = useParams();
    const [episodeDeleteId, setEpisodeDeleteId] = React.useState(null);
   const [snackbarMessage, setSnackbarMessage] = React.useState(null);

   let deleteFun = (id) => {
    setEpisodeDeleteId(()=> id)
  }

  let cancelDeleteFun = () => {
    setEpisodeDeleteId(null)
  }


  let deleteEpisodeMutation = useMutation(
    {
        mutationFn: deleteEpisode,
        onSuccess: async(data, variables, context) => { 
          
          setSnackbarMessage({message: data.message, severity: "success"});
          await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
          cancelDeleteFun()
         }, onError:(error)=>{
          //console.log("erroe", error)
          if (error?.message){
            setSnackbarMessage(() => ({message: error.message, severity: "error"}));
            cancelDeleteFun()
           }
        }
    }
  )

  let confirmDeleteFun = () => {
    deleteEpisodeMutation.mutate(episodeDeleteId)
//cancelDeleteFun()
}

   // console.log("season", params)

    const data = useMemo(() =>  season?.episodes ?? [], [season?.episodes]);
    const columnHelper = createColumnHelper();

    /** @type import('@tanstack/react-table).ColumnDef<any> */
    const columns = [
        {
            header: "Epi. no",
            accessorKey: "episode",
            footer: "episodeNumber",
        },
        {
            header: "episode Title",
            accessorKey: "title",
            footer: "episodeTitle",
        },
        columnHelper.accessor("releaseDate", { 
            cell: (info) => (
              <p>
               { moment(info.getValue()).format("DD/MMM/YYYY")}
               
              </p>
            ),
            header: "Release Date",
           
         }
        ),
        {
            header: "Year",
            accessorKey: "yearOfProduction",
            footer: "Content"
          },
        columnHelper.accessor("createdAt", { 
            cell: (info) => (
              <p>
               { moment(info.getValue()).format("DD/MMM/YYYY - hh:mm:ss a")}
               
              </p>
            ),
            header: "Date Created",
           
         }
        ),

        columnHelper.accessor("id", {
            cell: (info) => (
                <div className="flex gap-4">
                <Button onClick={() => navigate(`/content/view/series/${params?.id}/${season.id}/${info.row.original.id}`)} className="h-max w-max flex items-center justify-center px-0 py-0 bg-transparent hover:bg-transparent hover:text-primary-500">
                    <span className="icon-[solar--maximize-square-linear] w-6 h-6"></span>
                </Button>

                <Button onClick={()=> deleteFun(info.row.original.id)} className="h-max w-max flex items-center justify-center px-0 py-0 bg-transparent hover:bg-transparent hover:text-primary-500 text-opacity-60">
          <span className="icon-[solar--trash-bin-trash-bold] w-6 h-6"></span>
     
        </Button>
                </div>
                
            ),
            header: "",
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
      <CustomStack className="flex-col">
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
                  {/** create-new episode */}
                  <Button
                      onClick={() => handleNewEpisode()}
                      className="flex items-center gap-2 w-max bg-primary-500 bg-opacity-50 rounded-lg px-4"
                  >
                      <span className="icon-[solar--pen-new-square-linear] w-4 h-4"></span>
                      <Typography className="font-[Inter-SemiBold]">Add Episode</Typography>
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
                      {table.getRowModel().rows.length ? (
                          table.getRowModel().rows.map((row) => (
                              <tr key={row.id} className="border-y border-secondary-600 hover:bg-secondary-400">
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

          {
 /** Modal for deleting Episode */
         }
      {episodeDeleteId && (
        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 cursor-pointer">
          
          <div className="flex flex-col items-center bg-whites-500 text-white rounded-lg p-4 shadow-lg gap-5">
            <div className="text-xl font-bold font-[Inter-Bold]">Are you sure you want to delete this?</div>
            <div className="flex flex-col items-center bg-whites-500 text-white gap-5">

{deleteEpisodeMutation.isPending ?(<Button disabled className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]">Deleting...</Button>) : <>  <Button
              className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
              onClick={confirmDeleteFun}
            >
              Yes
            </Button>
            <Button
              className="bg-secondary-500 hover:bg-secondary-700 text-whites-40 font-bold font-[Inter-SemiBold] py-2 px-4 rounded min-w-[150px]"
              onClick={cancelDeleteFun}
            >
              No
            </Button></>
}
          
            </div>
           
          </div>
        </div>
      )}

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
  )
}

export default EpisodesListTable