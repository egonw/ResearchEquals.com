import { Link, Routes, useMutation } from "blitz"
import { OverflowMenuHorizontal32, Notification32, Settings32 } from "@carbon/icons-react"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"

import { useCurrentUser } from "../hooks/useCurrentUser"
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace"
import logout from "../../auth/mutations/logout"
import SettingsModal from "../modals/settings"

const FullWidthMenu = () => {
  const currentUser = useCurrentUser()
  const currentWorkspace = useCurrentWorkspace()
  const [logoutMutation] = useMutation(logout)

  if (currentUser && currentWorkspace) {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        {/* TODO: Workspace switcher */}
        <img
          className="h-8 w-8 rounded-full"
          src={currentWorkspace.avatar}
          alt={`Avatar of ${
            currentWorkspace.name ? currentWorkspace.name : currentWorkspace.handle
          }`}
        />
        <a
          href="#"
          className="ml-5 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="sr-only">View notifications</span>
          <Notification32 className="h-6 w-6" aria-hidden="true" />
        </a>
        <span className="sr-only">Open settings</span>
        <SettingsModal
          button={
            <Settings32
              className="h-6 w-6 text-gray-400 hover:text-gray-500 rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-hidden="true"
            />
          }
          user={currentUser}
          workspace={currentWorkspace}
        />
        <Menu as="div" className="flex-shrink-0 relative ml-5">
          <div>
            <Menu.Button className="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Open user menu</span>
              <OverflowMenuHorizontal32
                className="h-6 w-6 text-gray-400 hover:text-gray-500 "
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            {/* TODO: Add keyboard navigation */}
            <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
              <Menu.Item key="dropdown-dashboard">
                <Link href={Routes.Dashboard()}>
                  <button className="w-full block py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item key="dropdown-profile">
                <Link href={Routes.HandlePage({ handle: currentWorkspace.handle })}>
                  <button className="w-full block py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item key="dropdown-logout">
                <button
                  className="w-full block py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={async () => {
                    await logoutMutation()
                  }}
                >
                  Logout
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        {/* TODO: Add action */}
        <a
          href="#"
          className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create module
        </a>
      </div>
    )
  } else {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
        <Link href={Routes.LoginPage()}>
          <a className="whitespace-nowrap text-base hover:text-gray-300 border-2 border-indigo-600 px-4 py-2 text-white rounded">
            Log in
          </a>
        </Link>
        <Link href={Routes.SignupPage()}>
          <a className="ml-4 2xl:ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base text-white bg-indigo-600 hover:bg-indigo-700">
            Create account
          </a>
        </Link>
      </div>
    )
  }
}

export default FullWidthMenu
