import {BaseService} from "./BaseService";
import {AuthService} from "./AuthService";
import {TradesmanGridService} from "./TradesmanGridService";
import {Http, Response} from "@angular/http";

import {Settings} from "../settings";
import {Router} from "@angular/router";
import {ParentContractorInfo} from "../data/parent-contractor-grid/ParentContractorInfo";
import {IS_LOCAL_DEV_MODE, TestData} from "../utils/test/TestData";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/Rx";
import {Ids} from "../utils/Ids";
import {SendEmailData} from "../data/SendEmailData";

@Injectable()

export class ParentContractorGridService extends BaseService {

    public personsSubject: BehaviorSubject<ParentContractorInfo[]> = new BehaviorSubject<ParentContractorInfo[]>([]);
    private persons: ParentContractorInfo[] = [];

    constructor(private authService: AuthService, private gridService: TradesmanGridService, http: Http, settings: Settings, router: Router) {
        super(http, settings, router);
    }

    public reset() {
        this._applyPersons([]);
    }

    private _applyPersons(persons: ParentContractorInfo[]) {
        this.persons = persons;
        this.personsSubject.next(persons);
    }

    /* REFRESHES */

    public refreshPersons(callback?: () => void) {
        if (IS_LOCAL_DEV_MODE) {
            this.__delayCall(() => {
                this._applyPersons(this._parseParentContractors(TestData.getParentContractorsJson()));

                if (callback)
                    callback();
            });

            return;
        }

        /* real user */

        this._getRequest(this.http, this.settings.parentContractorsUrl(), {}, (res: Response) => {
            this._applyPersons(this._parseParentContractors(res.json()));

            if (callback)
                callback();
        });
    }

    public acceptInvitation(person: ParentContractorInfo, callback: (success: boolean) => void) {
        if (IS_LOCAL_DEV_MODE || this.authService.currentContractor._isTestContractor()) {
            this.__delayCall(() => {
                callback(true);
            });
            return;
        }

        /* real user */

        this._postRequest(this.http, this.settings.acceptInvitation_Url(), {
                InvitationKey: person.invitationKey.toString(),
            },
            (res: Response) => {
                callback(true)
            },
            () => {
                callback(false)
            })

    }

    public declineInvitation(person: ParentContractorInfo, callback: (success: boolean) => void) {
        if (IS_LOCAL_DEV_MODE || this.authService.currentContractor._isTestContractor()) {
            this.__delayCall(() => {
                callback(true);
            });
            return;
        }
        /* real user */
        this._postRequest(this.http, this.settings.declineInvitation_Url(person.invitationKey.toString()), {},
            (res: Response) => {
                callback(true)
            },
            () => {
                callback(false)
            })
    }

    public disconnect(person: ParentContractorInfo, callback: (success: boolean) => void) {
        if (IS_LOCAL_DEV_MODE || this.authService.currentContractor._isTestContractor()) {
            this.__delayCall(() => {
                callback(true);
            });
            return;
        }

        /* real user */
        this._postRequest(this.http, this.settings.disconnect_Url(person.parentContractorId.toString()), {},
            (res: Response) => {
                callback(true)
            },
            () => {
                callback(false);
            })

    }

    /* Send mail  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    public sendEmail(data: SendEmailData, callback: (success: boolean) => void) {
        if (IS_LOCAL_DEV_MODE || this.authService.currentContractor._isTestContractor()) {
            this.__delayCall(() => {
                callback(true);
            });
            return;
        }

        /* real user */
        this._postRequest(this.http, this.settings.parentContractorSendEmailUrl(), {
            ContractorIds: data.mainAddressee.toArray(),
            InvitationKeys: data.secondAddressee.toArray(),
            Subject: data.subject,
            Text: data.message.replace(/\n/g, '<br>')
        }, (res: Response) => {
            callback(true);
        }, () => {
            callback(false);
        });

    }

    /* Helpers  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    /* SELECTION */

    public togglePersonSelection(person: ParentContractorInfo, select: boolean) {
        if (person.parentContractorId) this.getPersonById(person.parentContractorId).isSelected = select;
        if (person.invitationKey) this.getPersonByKey(person.invitationKey).isSelected = select;
    }

    public clearTradesmenSelection() {
        for (let i = 0; i < this.persons.length; i++) {
            this.persons[i].isSelected = false;
        }
    }


    private getPersonById(id: number): ParentContractorInfo {
        for (let i = 0; i < this.persons.length; i++) {
            if (this.persons[i].parentContractorId == id)
                return this.persons[i];
        }
        return null;
    }

    private getPersonByKey(id: number): ParentContractorInfo {
        for (let i = 0; i < this.persons.length; i++) {
            if (this.persons[i].invitationKey == id)
                return this.persons[i];
        }
        return null;
    }


    public isAllSelected(): boolean {
        for (let i = 0; i < this.persons.length; i++) {
            if (!this.persons[i].isSelected)
                return false;
        }
        return true;
    }

    public selectAll(select: boolean) {
        for (let i = 0; i < this.personsSubject.getValue().length; i++) {
            this.persons[i].isSelected = select;
        }
    }

    public getSelectedContractorIds(): Ids[] {
        let idsById: Ids = new Ids();
        let idsByKey: Ids = new Ids();

        for (let i = 0; i < this.persons.length; i++) {
            if (this.persons[i].isSelected) {
                if (this.persons[i].parentContractorId) idsById.add(this.persons[i].parentContractorId);
                if (this.persons[i].invitationKey) idsByKey.add(this.persons[i].invitationKey);
            }
        }

        return [idsById,idsByKey];
    }

    public clearContractorSelection() {
        for (let i = 0; i < this.persons.length; i++) {
            this.persons[i].isSelected = false;
        }
    }

    public toggleContractorSelection(ID: number, select: boolean) {
        this.getContractorById(ID).isSelected = select;
    }

    public getContractorById(Id: number): ParentContractorInfo {
        for (let i = 0; i < this.persons.length; i++) {
            if (this.persons[i].invitationKey == Id)
                return this.persons[i];
        }

        return null;
    }


    private _parseParentContractors(json: any[]): ParentContractorInfo[] {
        if (!json) {
            console.log("no loaded parent contractors");
            return [];
        }

        let parsed: ParentContractorInfo[] = [];

        json.forEach((data) => {
            let info: ParentContractorInfo = new ParentContractorInfo();

            info.parentContractorId = data.ContractorId;
            info.invitationKey = data.InvitationKey;
            info.name = data.Name;
            info.email = data.Email;
            info.statusDate = data.StatusDate;
            parsed.push(info);
        });

        return parsed;
    }
}