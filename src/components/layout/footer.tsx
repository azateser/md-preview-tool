"use client";

import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent dark:from-purple-500/10" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="relative flex flex-col items-center text-center mb-16">
          <Link 
            href="/landing" 
            className="group relative flex items-center p-1 mb-6"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-20 blur-xl group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-lg px-4 py-2 ring-1 ring-gray-200/50 dark:ring-gray-800/50">
              <svg
                className="h-8 w-8 text-purple-600 dark:text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7V5Z"
                  fill="currentColor"
                />
                <path
                  d="M4 11C4 10.4477 4.44772 10 5 10H11C11.5523 10 12 10.4477 12 11V19C12 19.5523 11.5523 20 11 20H5C4.44772 20 4 19.5523 4 19V11Z"
                  fill="currentColor"
                />
                <path
                  d="M16 11C16 10.4477 16.4477 10 17 10H19C19.5523 10 20 10.4477 20 11V13C20 13.5523 19.5523 14 19 14H17C16.4477 14 16 13.5523 16 13V11Z"
                  fill="currentColor"
                />
                <path
                  d="M16 17C16 16.4477 16.4477 16 17 16H19C19.5523 16 20 16.4477 20 17V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V17Z"
                  fill="currentColor"
                />
              </svg>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                MD Preview
              </span>
            </div>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg text-lg mb-8">
            Modern markdown editor with real-time preview. Create beautiful GitHub profiles with ease.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/azateser"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
            >
              <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Github className="relative h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>
            <a
              href="https://twitter.com/azateser"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
            >
              <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Twitter className="relative h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>
            <a
              href="mailto:azateser@gmail.com"
              className="group relative p-2"
            >
              <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Mail className="relative h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto mb-16">
          {[
            {
              title: "Product",
              links: [
                { name: "Editor", href: "/" },
                { name: "Features", href: "/landing#features" },
                { name: "Changelog", href: "/changelog" }
              ]
            },
            {
              title: "Resources",
              links: [
                { name: "Documentation", href: "/docs" },
                { name: "Templates", href: "/" },
                { name: "Examples", href: "/" }
              ]
            },
            {
              title: "Support",
              links: [
                { name: "Help Center", href: "https://github.com/azateser/md-preview-tool/issues" },
                { name: "Feedback", href: "/feedback" },
                { name: "Contact", href: "https://linkedin.com/in/azateser" }
              ]
            },
            {
              title: "Legal",
              links: [
                { name: "Privacy", href: "https://github.com/azateser/md-preview-tool/" },
                { name: "Terms", href: "https://github.com/azateser/md-preview-tool/" },
                { name: "License", href: "https://github.com/azateser/md-preview-tool/" }
              ]
            }
          ].map((section, i) => (
            <div key={i} className="relative">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="relative z-10 transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {link.name}
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-600/40 to-blue-600/40 dark:from-purple-400/40 dark:to-blue-400/40 group-hover:w-full transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200/50 dark:border-gray-800/50" />
          </div>
          <div className="relative flex flex-col items-center justify-center space-y-4">
            <div className="bg-white dark:bg-gray-900 px-6 py-2 rounded-full border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-purple-600 dark:text-purple-400">©</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-medium">
                  {new Date().getFullYear()} MD Preview
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  All rights reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}