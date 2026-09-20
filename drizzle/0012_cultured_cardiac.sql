CREATE INDEX "boulder_post_boulder_name_idx" ON "boulder_post" USING btree ("boulder_name");--> statement-breakpoint
CREATE INDEX "boulder_post_status_idx" ON "boulder_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "camping_post_status_idx" ON "camping_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_message_session_id_idx" ON "chat_message" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "climb_post_route_id_idx" ON "climb_post" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX "climb_post_status_idx" ON "climb_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "post_reply_post_type_post_id_idx" ON "post_reply" USING btree ("post_type","post_id");--> statement-breakpoint
CREATE INDEX "post_reply_status_idx" ON "post_reply" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reservation_status_idx" ON "reservation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");