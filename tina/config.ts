import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Page Content",
        path: "content/pages",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
          },
          {
            type: "string",
            name: "professionalTitle",
            label: "Professional Title",
          },
          {
            type: "string",
            name: "status",
            label: "Status Text",
          },
          {
            type: "image",
            name: "profileImage",
            label: "Profile Image",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "bentoItems",
            label: "Bento Grid Items",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.title || "New Bento Item" };
              },
            },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description" },
              { type: "string", name: "link", label: "Link URL" },
              { type: "string", name: "icon", label: "Icon (Emoji or text)" },
              {
                type: "string",
                name: "size",
                label: "Grid Size",
                options: [
                  { label: "Small (1x1)", value: "small" },
                  { label: "Long (2x1)", value: "long" },
                  { label: "Big (2x2)", value: "big" },
                ],
              },
              {
                type: "string",
                name: "style",
                label: "Visual Style",
                options: [
                  { label: "Primary Gradient", value: "primary-gradient" },
                  { label: "White Outline", value: "white-outline" },
                  { label: "Warning Gradient", value: "warning-gradient" },
                  { label: "Accent Solid", value: "accent-solid" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "services",
            label: "Marquee Services",
            list: true,
            fields: [
              { type: "string", name: "label", label: "Service Label" },
              { type: "string", name: "icon", label: "Emoji Icon" },
            ],
          },
          {
            type: "object",
            name: "theme",
            label: "Theme Colors",
            fields: [
              { type: "string", name: "backgroundColor", label: "Background Color", ui: { component: "color" } },
              { type: "string", name: "primaryColor", label: "Primary Color", ui: { component: "color" } },
              { type: "string", name: "accentColor", label: "Accent Color", ui: { component: "color" } },
            ],
          },
          {
            type: "object",
            name: "navbar",
            label: "Navbar Settings",
            fields: [
              { type: "string", name: "brand", label: "Brand Name" },
              {
                type: "object",
                name: "navLinks",
                label: "Navigation Links",
                list: true,
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "link", label: "Link URL (e.g. #about)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer Settings",
            fields: [
              { type: "string", name: "text", label: "Copyright Text" },
            ],
          },
        ],
      },
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "image", name: "image", label: "Project Image" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "string", name: "description", label: "Short Description", ui: { component: "textarea" } },
          { type: "rich-text", name: "content", label: "Full Information (Modal Details)" },
          { type: "string", name: "link", label: "Project Link" },
        ],
      },
      {
        name: "experience",
        label: "Experience",
        path: "content/experience",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Job Title", isTitle: true, required: true },
          { type: "string", name: "company", label: "Company" },
          { type: "string", name: "date", label: "Dates (e.g. 2023 - Present)" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "boolean", name: "reverse", label: "Reverse Layout (Mobile Optimization)" },
        ],
      },
    ],
  },
});
