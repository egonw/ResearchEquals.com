import { useMutation, invokeWithMiddleware, InferGetServerSidePropsType, Link } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { ChangePassword, ChangeEmail, ChangeName } from "app/auth/validations"
import { Widget } from "@uploadcare/react-widget"

import Navbar from "../core/components/navbar"
import { Form, FORM_ERROR } from "../core/components/Form"
import changePassword from "app/auth/mutations/changePassword"
import changeEmail from "../users/mutations/changeEmail"
import changeName from "../users/mutations/changeName"
import getCurrentUser from "app/users/queries/getCurrentUser"
import getCurrentWorkspace from "app/workspaces/queries/getCurrentWorkspace"
import changeAvatar from "app/workspaces/mutations/changeAvatar"
import changeBio from "../workspaces/mutations/changeBio"
import changePronouns from "app/workspaces/mutations/changePronouns"

export const getServerSideProps = async ({ req, res }) => {
  const user = await invokeWithMiddleware(getCurrentUser, null, { req, res })
  const workspace = await invokeWithMiddleware(getCurrentWorkspace, null, { req, res })

  return { props: { user, workspace } }
}

const SettingsPage = ({
  user,
  workspace,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [changePasswordMutation, { isSuccess: passwordChanged }] = useMutation(changePassword)
  const [changeEmailMutation, { isSuccess: emailChanged }] = useMutation(changeEmail)
  const [changeNameMutation, { isSuccess: nameChanged }] = useMutation(changeName)
  const [changeAvatarMutation, { isSuccess: avatarChanged }] = useMutation(changeAvatar)
  const [changeBioMutation, { isSuccess: bioChanged }] = useMutation(changeBio)
  const [changePronounsMutation, { isSuccess: pronounsChanged }] = useMutation(changePronouns)

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto lg:relative pt-4">
        <div className="">
          <h1 className="font-bold text-6xl">Settings</h1>
          <h2 className="font-bold text-4xl">User</h2>
          <div>
            <h3 className="font-bold text-2xl">Name</h3>
            {nameChanged ? (
              <div>
                <h2>Name changed successfully</h2>
              </div>
            ) : (
              <Form
                className="m-0"
                submitText="Change name"
                schema={ChangeName}
                initialValues={{ name: user!.name! ?? "" }}
                onSubmit={async (values) => {
                  try {
                    await changeNameMutation(values)
                  } catch (error) {
                    return {
                      [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                    }
                  }
                }}
              >
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="name"
                  placeholder="Name"
                  label="Name"
                />
              </Form>
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl">Email</h3>
            {emailChanged ? (
              <div>
                <h2>Email changed successfully</h2>
              </div>
            ) : (
              <Form
                className="m-0"
                submitText="Change email"
                schema={ChangeEmail}
                initialValues={{ email: user!.email! }}
                onSubmit={async (values) => {
                  try {
                    await changeEmailMutation(values)
                  } catch (error) {
                    return {
                      [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                    }
                  }
                }}
              >
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="email"
                  placeholder="Email"
                  type="email"
                  label="Email"
                />
              </Form>
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl">Password</h3>
            {passwordChanged ? (
              <div>
                <h2>Password changed successfully</h2>
              </div>
            ) : (
              <Form
                className="m-0"
                submitText="Change password"
                schema={ChangePassword}
                initialValues={{ currentPassword: "", newPassword: "", newRepeat: "" }}
                onSubmit={async (values) => {
                  if (values.newPassword !== values.newRepeat) {
                    return {
                      [FORM_ERROR]: "Please check the new password for typo's",
                    }
                  }
                  try {
                    await changePasswordMutation(values)
                  } catch (error) {
                    if (error.name === "AuthenticationError") {
                      return {
                        [FORM_ERROR]: error.message,
                      }
                    } else {
                      return {
                        [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                      }
                    }
                  }
                }}
              >
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="currentPassword"
                  placeholder="Password"
                  type="password"
                  label="Current password"
                />
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="newPassword"
                  placeholder="Password"
                  type="password"
                  label="New password"
                />
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="newRepeat"
                  placeholder="Password"
                  type="password"
                  label="Repeat new password"
                />
              </Form>
            )}
          </div>
          <h2 className="font-bold text-4xl">Workspace</h2>
          <div>
            <h3 className="font-bold text-2xl">Avatar</h3>
            {avatarChanged ? (
              <div>
                <h2>Avatar changed successfully</h2>
              </div>
            ) : (
              <Widget
                publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
                crop="1:1"
                imageShrink="480x480"
                imagesOnly
                previewStep
                clearable
                onChange={async (info) => {
                  try {
                    // TODO: Remove old avatar from uploadcare after successfully updating
                    // TODO: Secure uploading
                    // https://uploadcare.com/docs/security/secure-uploads/
                    await changeAvatarMutation({
                      handle: workspace!.handle,
                      avatar: info.cdnUrl ?? "",
                    })
                  } catch (err) {
                    alert(err)
                  }
                  console.log("Upload completed:", info)
                }}
              />
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl">Bio</h3>
            {bioChanged ? (
              <div>
                <h2>Bio changed successfully</h2>
              </div>
            ) : (
              <Form
                className="m-0"
                submitText="Change bio"
                initialValues={{ bio: workspace!.bio }}
                onSubmit={async (values) => {
                  try {
                    await changeBioMutation({
                      handle: workspace!.handle,
                      bio: values.bio,
                    })
                  } catch (error) {
                    return {
                      [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                    }
                  }
                }}
              >
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="bio"
                  placeholder="Bio"
                  type="text"
                  label="Current Bio"
                />
              </Form>
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl">Pronouns</h3>
            {pronounsChanged ? (
              <div>
                <h2>Pronouns changed successfully</h2>
              </div>
            ) : (
              <Form
                className="m-0"
                submitText="Change pronouns"
                initialValues={{ pronouns: workspace!.pronouns }}
                onSubmit={async (values) => {
                  try {
                    await changePronounsMutation({
                      handle: workspace!.handle,
                      pronouns: values.pronouns,
                    })
                  } catch (error) {
                    return {
                      [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                    }
                  }
                }}
              >
                <LabeledTextField
                  className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="pronouns"
                  placeholder="Pronouns"
                  type="text"
                  label="Current pronouns"
                />
              </Form>
            )}
          </div>
          <div>
            <h3 className="font-bold text-2xl">Affiliation</h3>
          </div>
          <div>
            <h3 className="font-bold text-2xl">ORCID</h3>
            {!workspace!.orcid ? (
              <Link href="/api/auth/orcid">
                <a>Add ORCID</a>
              </Link>
            ) : (
              <p>{workspace!.orcid}</p>
            )}
          </div>
        </div>
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete your account</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Once you delete your account, you will lose all data associated with it.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

SettingsPage.authenticate = true
SettingsPage.getLayout = (page) => <Layout title="SettingsPage">{page}</Layout>

export default SettingsPage
