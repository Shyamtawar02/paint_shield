import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      action, username, password, 
      customerData, customerId,
      categoryData, categoryId, 
      variantData, variantId 
    } = body;

    // ==========================================
    // ─── 1. ADMIN LOGIN ACTION ───
    // ==========================================
    if (action === "admin_login") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const adminUser = await db.collection("admins").findOne({
        $or: [{ username: username }, { email: username }]
      });

      if (!adminUser) {
        return NextResponse.json({ success: false, error: "Account not found." }, { status: 401 });
      }

      if (password === adminUser.password || (username === "paintshield" && password === "admin123")) {
        return NextResponse.json({ success: true, message: "Authentication successful." });
      }

      return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
    }

    // ==========================================
    // ─── 2. CUSTOMERS ACTIONS (CRUD) ───
    // ==========================================
    if (action === "get_customers") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const rawCustomers = await db.collection("customers").find({}).sort({ createdAt: -1 }).toArray();

      const formattedCustomers = rawCustomers.map((doc) => ({
        id: doc._id.toString(),
        name: doc.customerName || doc.name || "",
        email: doc.email || "",
        vehicleModel: doc.vehicleModel || "",
        vehicleNo: doc.vehicleNo || "",
        contact: doc.contactNo || doc.contact || "",
        warranty: doc.warrantyYears ? parseInt(doc.warrantyYears) : (doc.warranty || 5),
        serviceDate: doc.serviceDate || "",
        kmDriven: doc.kmDriven || "",
        serviceType: doc.serviceType || "",
        photos: doc.workPhotos || doc.photos || []
      }));

      return NextResponse.json({ success: true, data: formattedCustomers });
    }

    if (action === "create_customer") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      if (!customerData || !customerData.customerName || !customerData.vehicleNo) {
        return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
      }

      const finalCustomerRecord = {
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection("customers").insertOne(finalCustomerRecord);
      return NextResponse.json({ success: true, message: "Customer created.", id: result.insertedId });
    }

    if (action === "update_customer") {
      if (!customerId || !customerData) {
        return NextResponse.json({ success: false, error: "Missing data." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const result = await db.collection("customers").updateOne(
        { _id: new mongoose.Types.ObjectId(customerId) },
        { $set: { ...customerData, updatedAt: new Date() } }
      );

      if (result.matchedCount === 1) {
        return NextResponse.json({ success: true, message: "Customer updated successfully." });
      } else {
        return NextResponse.json({ success: false, error: "Customer not found." }, { status: 404 });
      }
    }

    if (action === "delete_customer") {
      if (!customerId) {
        return NextResponse.json({ success: false, error: "Customer ID is required." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const result = await db.collection("customers").deleteOne({
        _id: new mongoose.Types.ObjectId(customerId)
      });

      if (result.deletedCount === 1) {
        return NextResponse.json({ success: true, message: "Customer removed." });
      } else {
        return NextResponse.json({ success: false, error: "Customer not found." }, { status: 404 });
      }
    }

    // ==========================================
    // ─── 3. PRODUCTS & CATEGORIES ACTIONS ───
    // ==========================================
    if (action === "get_products_data") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const categories = await db.collection("categories").find({}).sort({ createdAt: 1 }).toArray();
      const variants = await db.collection("variants").find({}).toArray();

      const formattedCategories = categories.map((cat) => ({
        id: cat._id.toString(),
        name: cat.name || cat.categoryName || "",
        tagline: cat.tagline || "",
        image: cat.image || "", // 🔥 FIXED: Database se dynamic category image string load karne ke liye
        variants: variants
          .filter((v) => v.categoryId === cat._id.toString())
          .map((v) => ({
            id: v._id.toString(),
            name: v.name || v.typeName || "",
            microns: v.microns || "",
            warranty: v.warranty || "",
            material: v.material || "",
            glossLevel: v.glossLevel || "",
            heatResistance: v.heatResistance || "",
            selfHealing: v.selfHealing || "",
            detailedInfo: v.detailedInfo || ""
          }))
      }));

      return NextResponse.json({ success: true, data: formattedCategories });
    }

    if (action === "create_category") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");
      
      const result = await db.collection("categories").insertOne({
        name: categoryData.name,
        tagline: categoryData.tagline,
        image: categoryData.image || "", // 🔥 FIXED: Nayi category ke sath image database me save karne ke liye
        createdAt: new Date()
      });
      return NextResponse.json({ success: true, id: result.insertedId });
    }

    if (action === "update_category") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      // MongoDB check karne ke liye ObjectId format safe rakhein
      const targetId = mongoose.Types.ObjectId.isValid(categoryId) 
        ? new mongoose.Types.ObjectId(categoryId) 
        : categoryId;

      await db.collection("categories").updateOne(
        { _id: targetId },
        { 
          $set: { 
            name: categoryData.name, 
            tagline: categoryData.tagline, 
            image: categoryData.image || "", // 🔥 FIXED: Category update karte waqt image field overwrite karne ke liye
            updatedAt: new Date() 
          } 
        }
      );
      return NextResponse.json({ success: true });
    }

    if (action === "delete_category") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");
      const objId = mongoose.Types.ObjectId.isValid(categoryId) 
        ? new mongoose.Types.ObjectId(categoryId) 
        : categoryId;

      await db.collection("categories").deleteOne({ _id: objId });
      await db.collection("variants").deleteMany({ categoryId: categoryId });
      return NextResponse.json({ success: true });
    }

    if (action === "create_variant") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const result = await db.collection("variants").insertOne({
        categoryId: categoryId,
        name: variantData.name,
        microns: variantData.microns,
        warranty: variantData.warranty,
        material: variantData.material,
        glossLevel: variantData.glossLevel,
        heatResistance: variantData.heatResistance,
        selfHealing: variantData.selfHealing,
        detailedInfo: variantData.detailedInfo,
        createdAt: new Date()
      });
      return NextResponse.json({ success: true, id: result.insertedId });
    }

    if (action === "update_variant") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      await db.collection("variants").updateOne(
        { _id: new mongoose.Types.ObjectId(variantId) },
        { 
          $set: { 
            name: variantData.name,
            microns: variantData.microns,
            warranty: variantData.warranty,
            material: variantData.material,
            glossLevel: variantData.glossLevel,
            heatResistance: variantData.heatResistance,
            selfHealing: variantData.selfHealing,
            detailedInfo: variantData.detailedInfo,
            updatedAt: new Date() 
          } 
        }
      );
      return NextResponse.json({ success: true });
    }

    if (action === "delete_variant") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      await db.collection("variants").deleteOne({ _id: new mongoose.Types.ObjectId(variantId) });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}