import { base, convertKeysToSnakeCase } from "@/lib/airtable";

const MEDIA_LOCATION_TABLE_NAME = "Media Locations";

export async function getMediaPoints() {
  const response = await base(MEDIA_LOCATION_TABLE_NAME)
    .select({
      view: process.env.AIRTABLE_VIEW_NAME,
    })
    .all()
    .then((records) => {
      return records
        .filter((record) => record.fields.Latitude && record.fields.Longitude)
        .map((record) => {
          const fields = convertKeysToSnakeCase(record.fields);

          return {
            id: record.id,
            name: fields.name,
            latitude: fields.latitude,
            longitude: fields.longitude,
            location_name: fields.location_name,
            natural_feature_name: fields.natural_feature_name,
            city: fields.city,
            region: fields.region,
            country: fields.country,
            media: {
              name: fields.name_from_media?.[0],
              original_title: fields.original_title_from_media?.[0],
              director: fields.director_from_media?.[0],
              release_year: fields.release_year_from_media?.[0],
              description: fields.description_from_media?.[0],
              image: fields.image_from_media?.[0],
              video: fields.video_from_media?.[0],
              video_link: fields.video_link_from_media?.[0],
              subjects: fields.subjects_from_media,
              language: fields.language_from_media,
              references: fields.references_from_media?.[0],
              rights: fields.rights_from_media?.[0],
              rights_statement_link:
                fields.rights_statement_link_from_media?.[0],
              media_type: fields.media_type_from_media?.[0],
            },
          };
        });
    });

  return response;
}
