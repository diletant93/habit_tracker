import LeafTL from '@/public/svgs/auth_leaf_tl.svg';
import LeafTR from '@/public/svgs/auth_leaf_tr.svg';
import LeafBR from '@/public/svgs/auth_leaf_br.svg';
import LeafBL from '@/public/svgs/auth_leaf_bl.svg';
import BackButton from '../_components/ui/BackButton';
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className='relative h-[100dvh]'>
            <LeafTL className="absolute top-0 left-0 z-0"/>
            <LeafTR className="absolute top-0 right-0 z-0"/>
            <LeafBR className="absolute top-45 right-0 z-0"/>
            <LeafBL className="absolute top-45 left-0 z-0"/>
            <BackButton variant='big' className='absolute top-12 left-4'/>
            <div className='relative pt-33 p-container flex flex-col z-10'>
                {children}
            </div>
        </main>
    );
}
