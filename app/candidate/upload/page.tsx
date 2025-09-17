import FileUploader from "@/components/FileUploader";

export default function(){
    return <div className="p-6">
        <h1 className="text-xl font-bold">Candidate Dashboard</h1>
        <p className="text-gray-600 mb-4">Upload your test recording:</p>
        <FileUploader />
      </div>
}