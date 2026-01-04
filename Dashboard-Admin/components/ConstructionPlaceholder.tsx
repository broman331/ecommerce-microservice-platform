

interface ConstructionPlaceholderProps {
    title: string;
}

export default function ConstructionPlaceholder({ title }: ConstructionPlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="relative w-64 h-64 mb-6">
                <img
                    src="/cat.png"
                    alt="Under Construction"
                    className="w-full h-full object-contain"
                />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500 text-lg">
                Our engineers (and cats) are working hard on this section.
                <br />
                Check back soon!
            </p>
        </div>
    );
}
