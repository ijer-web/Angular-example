import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {ParentContractorInfo} from "../../../data/parent-contractor-grid/ParentContractorInfo";
import {ParentContractorGridService} from "../../../services/ParentContractorGridService";
import {SendEmailDialog, SendEmailDialogMode} from "../dlg/SendEmailDlg";

@Component({
    selector: 'contractors-grid',
    templateUrl: '_html/_contractorsGrid.html'
})

export class ContractorsGrid implements AfterViewInit {

    persons: ParentContractorInfo[] = [];
    isAllRowsSelected: boolean;

    isToolbarButtonOn_sendEmail: boolean;
    isLoading: boolean = false;

    @ViewChild(SendEmailDialog) sendEmailDialog: SendEmailDialog;

    constructor(private parentContractorGridService: ParentContractorGridService) {
        this.isToolbarButtonOn_sendEmail = false;
        this.isAllRowsSelected = false;

    }

    ngAfterViewInit(): any {

        this.parentContractorGridService.refreshPersons(() => {

            /* subscribe after refreshing to avoid receiving default empty data */
            this.parentContractorGridService.personsSubject.subscribe((persons) => {
                this.isLoading = false;
                this.persons = persons;

            }, (error: any) => {
                console.log(error);
            });
        });

        this.sendEmailDialog.EmailSent.subscribe((wasSent: boolean) => {
            if (wasSent) {
                this.parentContractorGridService.clearTradesmenSelection();
                this.isAllRowsSelected = this.parentContractorGridService.isAllSelected();
            }
        });
    }

    onToolbarButton_sendEmail() {
        this.isToolbarButtonOn_sendEmail = true;
        let _this = this;

        this.sendEmailDialog.show(SendEmailDialogMode.forParentContractors, {
            hideCallback: function () {
                _this.isToolbarButtonOn_sendEmail = false;
            }
        });
    }

    onSelectAllRows(on: boolean) {
        this.isAllRowsSelected = on;
        this.parentContractorGridService.selectAll(this.isAllRowsSelected);
    }

    onToggleRow() {
        this.isAllRowsSelected = this.parentContractorGridService.isAllSelected();
    }
}