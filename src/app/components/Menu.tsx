'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import ComboBoxAnimation from '@/app/components/animations/ComboBoxAnimation';

interface DropDownItem {
  label: string;
  href: string;
}

interface DropDownMenuProps {
  items: DropDownItem[];
  trigger: ReactNode;
}

export default function DropDownMenu({ items, trigger }: DropDownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative my-auto" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="inline-block">
        {trigger}
      </div>

      {isOpen && (
        <ComboBoxAnimation>
          <div className="absolute right-0 left-0 top-0 bg-white/50 backdrop-blur-md rounded-lg shadow-lg w-64 z-10 dark:bg-grey/50 ">
            {items.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className="block w-full text-left px-4 py-3 hover:bg-black/20 cursor-pointer transition-all rounded-lg">
                {item.label}
              </Link>
            ))}
          </div>
        </ComboBoxAnimation>
      )}
    </div>
  );
}
