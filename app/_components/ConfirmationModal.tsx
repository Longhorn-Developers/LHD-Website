interface ConfirmationModalProps {
    title: string;
    message: string;
    confirmLabel: string;
    isLoading?: boolean;
    errorMessage?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({
    title,
    message,
    confirmLabel,
    isLoading = false,
    errorMessage,
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#211a16]/60 p-4 backdrop-blur-sm"
            onClick={onCancel}
            onKeyDown={(event) => {
                if (event.key === "Escape" && !isLoading) {
                    onCancel();
                }
            }}
        >
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-message"
                className="w-full max-w-md rounded-2xl border border-[#e7e2dc] bg-[#fffdfa] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="border-b border-[#eee9e3] px-6 py-5">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#BF5700]">
                        Longhorn Developers
                    </p>
                    <h2
                        id="confirmation-modal-title"
                        className="text-xl font-bold text-gray-900"
                    >
                        {title}
                    </h2>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <p
                        id="confirmation-modal-message"
                        className="text-sm leading-6 text-gray-700"
                    >
                        {message}
                    </p>
                    {errorMessage && (
                        <p role="alert" className="text-sm text-red-600">
                            {errorMessage}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-[#eee9e3] px-6 py-4">
                    <button
                        type="button"
                        autoFocus
                        disabled={isLoading}
                        onClick={onCancel}
                        className="rounded-lg border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#BF5700] hover:bg-[#fff7f0] hover:text-[#9a4600] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className="rounded-lg bg-[#a33a2a] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#842d22] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
}
