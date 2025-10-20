import { type ChangeEvent, useId, useState } from "react";
import { toast } from "react-toastify";
import { parseError } from "../../utils/error";
import { API_URL, getToken } from "../../utils/fetcher";

interface Props {
    onUploadSuccess: () => void;
    currentImageUrl?: string;
    label?: string;
    className?: string;
    competitionId: string | number;
}

export const ImageUpload = ({
    onUploadSuccess,
    currentImageUrl,
    label = "Upload Image",
    className = "",
    competitionId,
}: Props) => {
    const inputId = `image-upload-input--${useId()}`;
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleClearImage = async () => {
        if (!confirm("Are you sure you want to remove the header image?")) {
            return;
        }

        setIsUploading(true);

        try {
            const token = getToken();
            const response = await fetch(`${API_URL}competitions/competitions/${competitionId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ header_image_file: null, header_credit: "" }),
            });

            if (response.ok) {
                toast.success("Header image removed successfully");
                onUploadSuccess();
            } else {
                const errorData = await response.json();
                parseError(errorData).forEach((e: any) => toast.error(e));
            }
        } catch (error) {
            console.error("Clear image error:", error);
            toast.error("Failed to remove image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("header_image_file", file);

            const token = getToken();
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            });

            // Handle completion
            xhr.addEventListener("load", () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    try {
                        const response = JSON.parse(xhr.responseText);

                        if (response.header_image_file || response.id) {
                            // Upload was successful - trigger data refetch to get the latest state
                            console.log("Upload successful, triggering data refetch. Response:", response);
                            onUploadSuccess();
                            toast.success("Header image uploaded successfully");
                        } else {
                            console.error("Upload response:", response);
                            toast.error("Upload successful but no image data returned");
                        }
                    } catch (parseErrorException) {
                        console.error("Failed to parse upload response:", xhr.responseText, parseErrorException);
                        toast.error("Failed to parse upload response");
                    }
                } else {
                    // Handle error responses
                    console.error("Upload failed with status:", xhr.status);
                    console.error("Error response:", xhr.responseText);

                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        // parseError expects an object with a 'body' property
                        const errors = parseError({ body: errorResponse });

                        if (errors && errors.length > 0) {
                            errors.forEach((e: any) => toast.error(e));
                        } else {
                            toast.error(`Failed to upload image (Status: ${xhr.status})`);
                        }
                    } catch (parseException) {
                        console.error("Failed to parse error response:", parseException);
                        // Show the raw response if we can't parse it
                        if (xhr.responseText) {
                            toast.error(`Upload failed: ${xhr.responseText.substring(0, 100)}`);
                        } else {
                            toast.error(`Failed to upload image (Status: ${xhr.status})`);
                        }
                    }
                }
                setIsUploading(false);
                setUploadProgress(0);
            });

            // Handle errors
            xhr.addEventListener("error", () => {
                toast.error("Failed to upload image");
                setIsUploading(false);
                setUploadProgress(0);
            });

            xhr.open("PATCH", `${API_URL}competitions/competitions/${competitionId}/`);
            if (token) {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            }
            xhr.send(formData);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
            setIsUploading(false);
            setUploadProgress(0);
        }

        // Clear the input value so the same file can be selected again
        e.target.value = "";
    };

    return (
        <div className={className}>
            <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <div className="mt-1">
                <label
                    htmlFor={inputId}
                    className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 ${
                        isUploading ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <svg
                                className="mb-4 h-10 w-10 animate-spin text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Uploading... {uploadProgress}%</p>
                        </div>
                    ) : (
                        <>
                            {currentImageUrl && !currentImageUrl.includes("/api/") ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={currentImageUrl}
                                        alt="Current header"
                                        className="mb-4 max-h-32 max-w-full rounded-lg object-cover"
                                        onError={(e) => {
                                            // Hide broken images
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        Click to replace current image
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <svg
                                        className="mb-4 h-10 w-10 text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </>
                    )}
                </label>

                <input
                    id={inputId}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />

                {currentImageUrl && !currentImageUrl.includes("/api/") && (
                    <button
                        type="button"
                        onClick={handleClearImage}
                        disabled={isUploading}
                        className="mt-2 flex w-full items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                        <svg
                            className="mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        Remove Header Image
                    </button>
                )}
            </div>
        </div>
    );
};
