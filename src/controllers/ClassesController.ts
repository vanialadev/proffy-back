import {Request, Response} from 'express'
import db from "../database/connection";
import convertHourToMinutes from "../utils/converHourToMinutes";


interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
    
    async create(request: Request, response: Response) {

        const { name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;
      
        const insertedUsersIds = await db("users").insert({
          name,
          avatar,
          whatsapp,
          bio,
        });
      
        const trx = await db.transaction();
      
        try {
          const user_id = insertedUsersIds[0];
      
          await trx("users").insert({
            name,
            avatar,
            whatsapp,
            bio,
          });
      
          const insertedClassesIds = await trx("classes").insert({
            user_id,
            subject,
            cost,
          });
      
          const class_id = insertedClassesIds[0];
      
          const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return {
              class_id,
              week_day: scheduleItem.week_day,
              from: convertHourToMinutes(scheduleItem.from),
              to: convertHourToMinutes(scheduleItem.to),
            };
          });
      
          await trx("classes_schedule").insert(classSchedule);
      
          await trx.commit();
        } catch (err) {
          await trx.rollback();
          return response.status(400).json({
            error: "Unexpected error while creating new class",
          });
        }
      
        return response.send();
      }
}