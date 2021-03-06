import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../globals/helpers/http.service';
import { ModelsComponent, Course, User, Video } from "../../../globals/models/models.component";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  userInfo: User;
  coursesInfo: Course[];
  professorInfo: User[];
  videosInfo: Video[];
  uri: string;

  constructor(private _httpService: HttpService) {
    this.uri = ModelsComponent.api + ModelsComponent.version;
    const user = this._httpService.currentUserValue;
    this._httpService.getUserAct(user._id).subscribe(us => { // servicio http devuelve la info del usuario
      this.userInfo = us as User;
      if (this.userInfo.coursesID.length > 0) {
        this._httpService.getCoursesInfo(this.userInfo.coursesID).subscribe(courses => {
          this.coursesInfo = courses as Array<Course>;
          let professorsID = [];
          for (let i = 0; i < this.coursesInfo.length; i++) {
            professorsID[i] = this.coursesInfo[i].professorID;
          }
          if (professorsID.length > 0) {
            this._httpService.getProfessorsInfo(professorsID).subscribe(prof => {
              this.professorInfo = prof as Array<User>;
            });
          }
        });
        this._httpService.getVideosInfo(this.userInfo.coursesID).subscribe(videos => {
          this.videosInfo = videos as Array<Video>;
        });
      }
    }, err => console.log(err));
  }

  ngOnInit(): void {
  }

}
