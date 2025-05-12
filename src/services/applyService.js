
import { applyModel } from '~/models/applyModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const validateFile = (file) => {
    if (!file) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng gửi file CV')
    }
    const fileExtension = file.originalname.split('.').pop().toLowerCase()
    if (!['pdf', 'docx'].includes(fileExtension)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Chỉ chấp nhận file PDF hoặc DOCX')
    }
    if (file.size > 5 * 1024 * 1024) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'File phải nhỏ hơn 5MB')
    }
    return fileExtension
}

const createApply = async (body, file) => {
    try {
    // Validate file và lấy fileExtension
        const fileExtension = validateFile(file)


        // Upload file lên Cloudinary
        const uploadResult = await cloudinaryProvider.streamUpLoadForCV(
            file.buffer,
            'it_jobs/cv',
            fileExtension
        )


        // Chuẩn bị dữ liệu cho applyModel
        const applyDoc = {
            email: body.email,
            employerId: body.employerId,
            jobId: body.jobId,
            fullName: body.fullName,
            phoneNumber: body.phoneNumber,
            cvUrl: uploadResult.secure_url,
            status: 'pending'
        }

        // Lưu vào MongoDB
        return await applyModel.createNew(applyDoc)
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Dữ liệu không hợp lệ: ' + error.message)
        }
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Gửi hồ sơ thất bại: ' + error.message
        )
    }
}

export const applyService = {
    createApply
}