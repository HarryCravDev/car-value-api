import { Body, Controller, Post, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/users/decorators/current-user-decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve.report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService){}

    @Get()
    getEstimate(@Query() query: GetEstimateDto){
        console.log("Query: ", query);
        return this.reportsService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    creatReport(@Body() body: CreateReportDto, @CurrentUser() user: User){
        return this.reportsService.create(body, user);
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        return this.reportsService.changeApprovel(id, body.approved);
    }

    @Get('/:id')
    @Serialize(ReportDto)
    getReport(@Param('id') id: string){
        console.log("Param: ", id);
        return this.reportsService.getReport(parseInt(id));
    }
}
