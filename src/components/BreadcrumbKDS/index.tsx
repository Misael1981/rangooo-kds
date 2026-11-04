"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const BreadcrumbKDS = () => {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;

  const allSegments = pathname.split("/").filter(Boolean);

  const segments = allSegments.slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={`/${slug}`}>Início</Link>} />
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          // Monta a URL válida acumulando os segmentos até o atual
          const href = `/${slug}/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link href={href} className="capitalize">
                        {segment}
                      </Link>
                    }
                  />
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbKDS;
