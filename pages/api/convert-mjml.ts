// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { compile } from "handlebars";
import type { NextApiRequest, NextApiResponse } from "next";
import { MjmlMapper } from "../../Helpers/MjmlMapper";

type Data = {
  html: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const requestBody: { mjml: string; context: string } = req.body;
  const htmlRes = new MjmlMapper(compile(requestBody.mjml))
    .toHtml(JSON.parse(requestBody.context))
    .replace(/&#x3D;/g, "=")
    .replace(/&amp;/g, "&");
  res.status(200).json({ html: htmlRes });
}
