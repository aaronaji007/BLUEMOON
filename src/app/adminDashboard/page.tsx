"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "../components/logoutButton";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen mt-16 md:mt-24 flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Sidebar */}
      <aside className="w-full xl:w-1/4 md:w-1/3 bg-blue-900 bg-opacity-90 backdrop-blur-lg text-white p-6 flex flex-col gap-6 shadow-2xl md:rounded-r-3xl border-r-4 border-blue-800">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center tracking-wide drop-shadow-lg mt-6">
          🛠️ ADMIN DASHBOARD
        </h2>

        <nav className="flex flex-col gap-4">
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/menuSetup")}
          >
            🍽️ SETUP MENU CARD
          </button>

          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/offerSetup")}
          >
            🎁 SETUP OFFERS
          </button>

          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/admin/user-management/roles-permissions")}
          >
            👥 USER MANAGEMENT
          </button>

          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/admin/customer-management/roles-permissions")}
          >
            👤 CUSTOMER MANAGEMENT
          </button>

          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/admin/edit/editBlog")}
          >
            ✏️ EDIT
          </button>
           <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/admin/orders")}
          >
            📦 ORDERS
          </button>
           <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/admin/reservation")}
          >
            🗓️ RESERVATION
          </button>
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/admin/contact")}
          >
            💬 CONTACTS
          </button>

          <LogoutButton />
        </nav>
      </aside>

      {/* Main Content */}
     <main className="flex-1 p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-8">
          {/* Setup Offers */}
          <section
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200 cursor-pointer"
            onClick={() => router.push("/offerSetup")}
          >
            <h3 className="text-2xl font-bold text-blue-900 mb-4">🎁 SETUP OFFERS</h3>
            <div className="flex flex-col gap-4 items-center">
              <button className="py-3 px-4 w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🌞 DAILY OFFERS
              </button>

              <button className="py-3 px-4 w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🎉 WEEKEND OFFERS
              </button>
              <button className="py-3 px-4 w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🌿 SEASONAL OFFERS
              </button>
            </div>
          </section>

          {/* Customer Management */}
          <section className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">👤 CUSTOMER MANAGEMENT</h3>
            <div className="flex flex-col gap-4 items-center">
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/customer-management/roles-permissions")}>
                🔐 Customer Roles & Permissions
              </button>
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/customer-management/listing-search")}>
                🔍 Customer Listing & Search
              </button>
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/customer-management/customer-editing")}>
                ✏️ Customer Creation & Editing
              </button>
            </div>
          </section>

          {/*EDIT */}
          <section
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200 cursor-pointer"

          >
            <h3 className="text-2xl font-bold text-blue-900 mb-4">✏️ EDIT</h3>
            <div className="flex flex-col gap-4 items-center">
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/edit/editBlog")}>
                🍳 BLOGS
              </button>
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/edit/editCookingVideo")}>
                🍽️ COOKING VIDEO
              </button>
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/edit/editGallery")}>
                🖼️ GALLERY
              </button>
            </div>
          </section>

          {/* User Management */}
          <section className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4"> 👥 USER MANAGEMENT </h3>
            <div className="flex flex-col gap-4 items-center">
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/user-management/roles-permissions")}>
                🔐 User Roles & Permissions
              </button>
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/user-management/registration-login")}>
                🏷️ User Registration & Login
              </button>

              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md" onClick={() => router.push("/admin/user-management/user-editing")}>
                ✏️ User Creation & Editing
              </button>
            </div>
          </section>

          {/* Setup Menu */}
          <section
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200 cursor-pointer"
            onClick={() => router.push("/menuSetup")}>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">🍽️ SETUP MENU</h3>
            <div className="flex flex-col gap-4 items-center">
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🍳 BREAKFAST
              </button>
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🍛 MAIN COURSE
              </button>
              
              <button className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🥤 DRINKS
              </button>
            </div>
          </section>

                    <section
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200 cursor-pointer"
            >
            <h3 className="text-2xl font-bold text-blue-900 mb-4">📝 CHECKOUT</h3>
            <div className="flex flex-col gap-4 items-center">
              <button onClick={() => router.push("/admin/orders")} 
              className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                📦 ORDERS
              </button>
              <button onClick={() => router.push("/admin/reservation")}
              className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🗓️ RESERVATIONS
              </button>
              <button  onClick={() => router.push("/admin/contact")}
              className="w-full sm:w-[300px] md:w-[350px] lg:w-[280px] xl:w-[350px] py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                💬 CONTACTS
              </button>
              
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
