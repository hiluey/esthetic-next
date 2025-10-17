import type { SVGProps } from "react";
import Image from "next/image";

export function Logo(props: SVGProps<SVGSVGElement>) {
    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
                <div className="">
                    <Image
                        src="/logo.png"
                        alt="Estetify Logo"
                        width={200}
                        height={200}
                        className="object-contain"
                        priority
                    />
                </div>

            </div>
        </div>
    );
}
