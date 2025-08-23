import toast from "react-hot-toast";

import { Axios } from "@/app/config/axios";

export const downloadContract = async (id: string) => {
  try {
    toast.success("Download will begin shortly");

    const response = await Axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/contract/${id}/download`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lexi-${id + "contract-summary" || "contract"}.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error("Error downloading contract");
    console.error("Error downloading contract:", error);
  }
};
