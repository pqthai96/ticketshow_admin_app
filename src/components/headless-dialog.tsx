"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export function HeadlessDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-[80vw] h-[90vh] bg-white rounded-2xl p-6 shadow-xl relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <svg width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#000000"
                        d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" />
                </svg>
              </button>

              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Tiêu đề của Dialog
              </Dialog.Title>
              <div className="mt-4 text-gray-700">
                Nội dung của Dialog. Bạn có thể đặt form hoặc bất kỳ nội dung nào ở đây.
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}