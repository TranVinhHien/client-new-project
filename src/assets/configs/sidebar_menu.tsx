import { MenuItemType } from '@/assets/types/menu';
import ROUTER from './routers';
import { roleE } from './general';
import { Ribeye } from 'next/font/google';


const SIDEBAR_MENU: MenuItemType[] = [
    {
        code: 'Home',
        label: 'Trang chủ',
        parent: 'Home',
        to: ROUTER.home

    },
    {
        code: 'master_data',
        label: 'Quản lý hệ thống',
        parent: 'master_data',
        items: [
            {
                code: 'Department',
                parent: 'master_data',
                label: 'Ngành',
                to: ROUTER.master.department,
            },
            {
                code: 'Subject',
                parent: 'master_data',
                label: 'Bộ môn',
                to: ROUTER.master.subject,
            },

        ],
    },
    {
        code: 'source_data',
        label: 'Dữ liệu chung',
        parent: 'source_data',
        // permission: [roleE.admin, roleE.giaovu],
        items: [
            {
                code: 'teacherList',
                parent: 'source_data',
                label: 'danh sách giáo viên',
                to: ROUTER.source_data.teachers,

            },
            {
                code: 'studentList',
                parent: 'source_data',
                label: 'danh sách sinh viên',
                to: ROUTER.source_data.students,

            },

        ],
    },
    {
        code: 'graduation_thesis',
        label: 'Đồ án tốt nghiệp',
        parent: 'graduation_thesis',
        items: [
            {
                code: 'thesis',
                parent: 'graduation_thesis',
                label: 'Đề tài',
                //to: ROUTER.graduation_thesis.thesis.list_thesis,
                items: [
                    {
                        code: 'list_thesis',
                        parent: 'thesis',
                        label: 'danh sách đề tài',
                        // permission: [roleE.giaovien],
                        to: ROUTER.graduation_thesis.thesis.list_thesis,

                    },
                    {
                        code: 'my_thesis',
                        parent: 'thesis',
                        label: 'đề tài của tôi',
                        permission: [roleE.giaovien],
                        to: ROUTER.graduation_thesis.thesis.my_thesis,

                    },
                    {
                        code: 'thesis_to_approve ',
                        parent: 'thesis',
                        label: 'duyệt đề tài',
                        permission: [roleE.truongbomon],
                        to: ROUTER.graduation_thesis.thesis.list_thesis_to_approve,

                    },

                ],
            },
            {
                code: 'list_student_join',
                parent: 'graduation_thesis',
                label: 'Danh sách sinh viên',
                to: ROUTER.graduation_thesis.list_student_join
            },
            {
                code: 'thesis_defense_schedule',
                parent: 'graduation_thesis',
                label: 'Lịch phản biện',
                to: ROUTER.graduation_thesis.thesis_defense_schedule,
                permission: [roleE.giaovien]

            },
            {
                code: 'point',
                parent: 'graduation_thesis',
                label: 'Điểm',
                to: ROUTER.graduation_thesis.point
            },
        ],
    },
    {
        code: 'job',
        label: 'Nhiệm vụ',
        parent: 'job',
        // icon: <FaBriefcase />,
        items: [
            {
                code: 'tasks_group',
                parent: 'job',
                label: 'Đề tài nhóm',
                to: ROUTER.job.tasks_group,
                permission: [roleE.giaovien, roleE.truongkhoa, roleE.truongbomon]
            },
            {
                code: 'tasks_assignment',
                parent: 'job',
                label: 'Giao nhiệm vụ',
                to: ROUTER.job.tasks_assignment,
                permission: [roleE.truongkhoa, roleE.truongbomon]
            },
            {
                code: 'tasks_assigned',
                parent: 'job',
                label: 'Nhiệm vụ được giao',
                to: ROUTER.job.tasks_assigned,
            },

        ],
    },
    {
        code: 'infomation',
        label: 'Thông tin',
        parent: 'infomation',
        //permission: [roleE.admin, roleE.truongbomon],
        // icon: <FaInfoCircle />
    },
    {
        code: 'settings',
        label: 'Settings',
        parent: 'settings',
        //permission: [roleE.admin, roleE.giaovien],
        // icon: <FaCog />

    },


];

export { SIDEBAR_MENU };
