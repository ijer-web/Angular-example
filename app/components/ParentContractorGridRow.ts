import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {ParentContractorInfo} from "../../../data/parent-contractor-grid/ParentContractorInfo";
import {Checkbox} from "../../../shared/Checkbox";
import {ParentContractorGridService} from "../../../services/ParentContractorGridService";
import {Alert} from "../../../shared/Alert";

@Component({
    selector: 'contractors-grid-row',
    templateUrl: '_html/_contractorsGridRow.html'
})

export class ContractorsGridRow implements AfterViewInit{
    @Input() person: ParentContractorInfo;

    @Output() ToggleRow: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild(Checkbox) checkbox: Checkbox;

    isLoading: boolean = false;

    constructor(private parentContractorGridService: ParentContractorGridService) {

    }

    ngAfterViewInit(): any {
        /* toggle row */
        this.checkbox.Touch.subscribe((on: boolean) => {
            if (!this.person)
                return;

            this.parentContractorGridService.togglePersonSelection(this.person, on);
            this.ToggleRow.emit('');
        });

        return undefined;
    }

    onAcceptInvitation() {
        this.isLoading = true;
        this.parentContractorGridService.acceptInvitation(this.person, (success: boolean) => {
            if (success) {

                this.parentContractorGridService.refreshPersons(()=>{
                    this.isLoading = false;
                    new Alert().showMessage(`Invitation was accepted`);

                });
            }
        });
    }

    onDeclineInvitation() {
        this.isLoading = true;


        this.parentContractorGridService.declineInvitation(this.person, (success: boolean) => {
            if (success) {

                this.parentContractorGridService.refreshPersons(()=>{
                    this.isLoading = false;
                    new Alert().showMessage(`Invitation was declined`);

                });
            }
        });
    }

    onDisconnect() {
        this.isLoading = true;

        this.parentContractorGridService.disconnect(this.person, (success: boolean) => {
            if (success) {

                this.parentContractorGridService.refreshPersons(()=>{
                    this.isLoading = false;
                    new Alert().showMessage(`Connection was disconnected`);

                });
            }
        });
    }
}