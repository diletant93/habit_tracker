export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-3xl text-red-400">
            layout
            {children}
        </div>
    );
}
