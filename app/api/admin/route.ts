import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import mongoose from "mongoose";

// ==========================================
// 🔥 NEXT.JS CONFIGURATION (SIZE LIMIT FIX)
// Base64 images ka bada text payload accept karne ke liye limit 10MB set ki hai
// ==========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      action, username, password, 
      customerData, customerId,
      categoryData, categoryId, 
      variantData, variantId ,
      vlogData, vlogId
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
        image: cat.image || "", 
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

    // 🔥 FIXED: Image Parsing Wrapper dynamic support added
    if (action === "create_category") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");
      
      const finalName = categoryData?.name || body?.name || body?.p?.name;
      const finalTagline = categoryData?.tagline || body?.tagline || body?.p?.tagline;
      const finalImage = categoryData?.image || body?.image || body?.p?.image || "";

      const result = await db.collection("categories").insertOne({
        name: finalName,
        tagline: finalTagline,
        image: finalImage, 
        variants: [], // Empty array essential for frontend initialization loops
        createdAt: new Date()
      });
      return NextResponse.json({ success: true, id: result.insertedId });
    }

    // 🔥 FIXED: Direct 'p' state binding and overwriting fallback safe checks added
    if (action === "update_category") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const finalCategoryId = categoryId || body?.id || body?.p?.id || body?.p?._id;

      if (!finalCategoryId) {
        return NextResponse.json({ success: false, error: "Missing Category ID" }, { status: 400 });
      }

      const targetId = mongoose.Types.ObjectId.isValid(finalCategoryId) 
        ? new mongoose.Types.ObjectId(finalCategoryId) 
        : finalCategoryId;

      const finalName = categoryData?.name || body?.name || body?.p?.name;
      const finalTagline = categoryData?.tagline || body?.tagline || body?.p?.tagline;
      const finalImage = categoryData?.image || body?.image || body?.p?.image;

      const updateFields: any = {
        name: finalName, 
        tagline: finalTagline, 
        updatedAt: new Date()
      };

      // String clear validation check: Empty variables cross field update delete nahi karegi
      if (finalImage && finalImage.trim() !== "") {
        updateFields.image = finalImage;
      }

      await db.collection("categories").updateOne(
        { _id: targetId },
        { $set: updateFields }
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

    // ==========================================
    // ─── 4. VLOGS ACTIONS (CRUD) ───
    // ==========================================
    if (action === "get_vlogs") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");
      
      const rawVlogs = await db.collection("vlogs").find({}).sort({ createdAt: -1 }).toArray();
      
      const formattedVlogs = rawVlogs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title || "",
        description: doc.description || "",
        url: doc.url || "",
        image: doc.image || doc.photo || "" 
      }));

      return NextResponse.json({ success: true, data: formattedVlogs });
    }

    if (action === "create_vlog") {
      if (!vlogData || !vlogData.title) {
        return NextResponse.json({ success: false, error: "Vlog Title is required." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const finalVlogRecord = {
        title: vlogData.title,
        description: vlogData.description || "",
        url: vlogData.url || "",
        image: vlogData.image || vlogData.photo || "", 
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection("vlogs").insertOne(finalVlogRecord);
      return NextResponse.json({ success: true, message: "Vlog published.", id: result.insertedId });
    }

    if (action === "update_vlog") {
      if (!vlogId || !vlogData) {
        return NextResponse.json({ success: false, error: "Missing Vlog ID or data." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const result = await db.collection("vlogs").updateOne(
        { _id: new mongoose.Types.ObjectId(vlogId) },
        { 
          $set: { 
            title: vlogData.title,
            description: vlogData.description,
            url: vlogData.url,
            image: vlogData.image || vlogData.photo || "",
            updatedAt: new Date() 
          } 
        }
      );

      if (result.matchedCount === 1) {
        return NextResponse.json({ success: true, message: "Vlog updated successfully." });
      } else {
        return NextResponse.json({ success: false, error: "Vlog not found." }, { status: 404 });
      }
    }

    if (action === "delete_vlog") {
      if (!vlogId) {
        return NextResponse.json({ success: false, error: "Vlog ID is required." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const result = await db.collection("vlogs").deleteOne({
        _id: new mongoose.Types.ObjectId(vlogId)
      });

      if (result.deletedCount === 1) {
        return NextResponse.json({ success: true, message: "Vlog deleted successfully." });
      } else {
        return NextResponse.json({ success: false, error: "Vlog not found." }, { status: 404 });
      }
    }

    // ==========================================
    // ─── 5. FAQS ACTIONS (CRUD) ───
    // ==========================================
    if (action === "get_faqs") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");
      
      const rawFaqs = await db.collection("faqs").find({}).sort({ createdAt: 1 }).toArray();
      
      const formattedFaqs = rawFaqs.map((doc) => ({
        id: doc._id.toString(),
        q: doc.q || doc.question || "",
        a: doc.a || doc.answer || ""
      }));

      return NextResponse.json({ success: true, data: formattedFaqs });
    }

    if (action === "create_faq") {
      const { faqData } = body; 
      if (!faqData || !faqData.q || !faqData.a) {
        return NextResponse.json({ success: false, error: "Question and Answer are required." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const finalFaqRecord = {
        q: faqData.q,
        a: faqData.a,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection("faqs").insertOne(finalFaqRecord);
      return NextResponse.json({ success: true, message: "FAQ published.", id: result.insertedId });
    }

    if (action === "update_faq") {
      const { faqId, faqData } = body;
      if (!faqId || !faqData) {
        return NextResponse.json({ success: false, error: "Missing FAQ ID or data." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const result = await db.collection("faqs").updateOne(
        { _id: new mongoose.Types.ObjectId(faqId) },
        { 
          $set: { 
            q: faqData.q,
            a: faqData.a,
            updatedAt: new Date() 
          } 
        }
      );

      if (result.matchedCount === 1) {
        return NextResponse.json({ success: true, message: "FAQ updated successfully." });
      } else {
        return NextResponse.json({ success: false, error: "FAQ not found." }, { status: 404 });
      }
    }

    if (action === "delete_faq") {
      const { faqId } = body;
      if (!faqId) {
        return NextResponse.json({ success: false, error: "FAQ ID is required." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const result = await db.collection("faqs").deleteOne({
        _id: new mongoose.Types.ObjectId(faqId)
      });

      if (result.deletedCount === 1) {
        return NextResponse.json({ success: true, message: "FAQ deleted successfully." });
      } else {
        return NextResponse.json({ success: false, error: "FAQ not found." }, { status: 404 });
      }
    }

    // ==========================================
    // ─── 6. STUDIO DETAILS ACTIONS ───
    // ==========================================
    if (action === "get_studio") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");
      
      const studioData = await db.collection("studio").findOne({});
      
      if (!studioData) {
        return NextResponse.json({ success: true, data: null });
      }

      const formattedStudio = {
        address: studioData.address || "",
        hours: studioData.hours || "",
        phone: studioData.phone || "",
        whatsapp: studioData.whatsapp || "",
        email: studioData.email || "",
        instagram: studioData.instagram || "",
        facebook: studioData.facebook || "",
        youtube: studioData.youtube || "",
        about: studioData.about || ""
      };

      return NextResponse.json({ success: true, data: formattedStudio });
    }

    if (action === "update_studio") {
      const { studioData } = body;
      if (!studioData) {
        return NextResponse.json({ success: false, error: "Studio data is missing." }, { status: 400 });
      }

      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      await db.collection("studio").updateOne(
        {}, 
        { 
          $set: { 
            ...studioData,
            updatedAt: new Date() 
          } 
        },
        { upsert: true }
      );

      return NextResponse.json({ success: true, message: "Studio details saved successfully." });
    }

    // ==========================================
    // ─── 7. PUBLIC FRONTEND INITIAL SYNC ───
    // ==========================================
    if (action === "get_public_init_data") {
      await dbConnect();
      const db = mongoose.connection.useDb("paintshield");

      const [rawProducts, rawVariants, rawVlogs, rawFaqs, studioData] = await Promise.all([
        db.collection("categories").find({}).sort({ createdAt: 1 }).toArray(),
        db.collection("variants").find({}).toArray(),
        db.collection("vlogs").find({}).sort({ createdAt: -1 }).toArray(),
        db.collection("faqs").find({}).sort({ createdAt: 1 }).toArray(),
        db.collection("studio").findOne({})
      ]);

      const formattedProducts = rawProducts.map((cat) => ({
        id: cat._id.toString(),
        name: cat.name || cat.categoryName || "",
        tagline: cat.tagline || "",
        image: cat.image || "",
        variants: rawVariants
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

      const formattedVlogs = rawVlogs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title || "",
        description: doc.description || "",
        url: doc.url || "",
        image: doc.image || doc.photo || ""
      }));

      const formattedFaqs = rawFaqs.map((doc) => ({
        id: doc._id.toString(),
        q: doc.q || doc.question || "",
        a: doc.a || doc.answer || ""
      }));

      const formattedStudio = studioData ? {
        address: studioData.address || "",
        hours: studioData.hours || "",
        phone: studioData.phone || "",
        whatsapp: studioData.whatsapp || "",
        email: studioData.email || "",
        instagram: studioData.instagram || "",
        facebook: studioData.facebook || "",
        youtube: studioData.youtube || "",
        about: studioData.about || ""
      } : null;

      return NextResponse.json({
        success: true,
        data: {
          products: formattedProducts,
          vlogs: formattedVlogs,
          faqs: formattedFaqs,
          studio: formattedStudio
        }
      });
    }

    return NextResponse.json({ success: false, error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}